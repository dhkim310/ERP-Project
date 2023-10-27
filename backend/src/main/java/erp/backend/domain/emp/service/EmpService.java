package erp.backend.domain.emp.service;

import erp.backend.domain.emp.dto.*;
import erp.backend.domain.emp.entity.Emp;
import erp.backend.domain.emp.repository.EmpRepository;
import erp.backend.domain.emp.vo.EmpVo;
import erp.backend.domain.vacation.entity.Vacation;
import erp.backend.domain.vacation.repository.VacationRepository;
import erp.backend.domain.vacation.service.VacationService;
import erp.backend.global.config.security.SecurityHelper;
import erp.backend.global.config.security.jwt.JwtProvider;
import erp.backend.global.mailsender.service.MailService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmpService {
    private final EmpRepository empRepository;
    private final VacationRepository vacationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final MailService mailService;
    private final EmpVo empVo;

    @Transactional(readOnly = true) // 인사관리 리스트
    public List<EmpHrmListResponse> searchAllList() {
        List<Emp> list = empRepository.findAll();

        return list.stream()
                .map(emp -> EmpHrmListResponse.builder()
                        .empId(emp.getEmpId())
                        .empName(emp.getEmpName())
                        .empPosition(emp.getEmpPosition())
                        .empEmail(emp.getEmpEmail())
                        .empStatus(emp.getEmpStatus())
                        .dept(emp.getDept().getDeptName())
                        .build())
                .toList();
    }

    @Transactional(readOnly = true) // 인사이동 페이지
    public EmpReshuffleResponse reshuffleResponse(Long id) {
        Emp emp = getEmpAccountId(id);

        return EmpReshuffleResponse.builder()
                .empId(emp.getEmpId())
                .deptId(emp.getDept().getDeptId())
                .empName(emp.getEmpName())
                .deptName(emp.getDept().getDeptName())
                .empEmail(emp.getEmpEmail())
                .empPosition(emp.getEmpPosition())
                .empStartDate(emp.getEmpStartDate())
                .empEndDate(emp.getEmpEndDate())
                .empStatus(emp.getEmpStatus())
                .build();
    }

    @Transactional // 인사이동 업데이트
    public Long updateReshuffle(Long id, EmpReshuffleRequest request) {
        Emp emp = getEmpAccountId(id);
        emp.updateReshuffle(request);
        return emp.getEmpId();
    }

    @Transactional
    public void signUp(SignUpRequest request) {
        // 신입 사원은 초기 비밀번호가 1541로 설정
        Emp emp = Emp.builder()
                .empName(request.getEmpName())
                .empEmail(request.getEmpEmail())
                .dept(request.getEmpDeptId())
                .password(passwordEncoder.encode("1541")) // 사원의 초기 비밀번호 1541
                .empPosition(request.getEmpPosition())
                .roles(empVo.type1(request.getEmpPosition()))
                .empAmount(empVo.type2(request.getEmpPosition()))
                .empBirthday(request.getEmpBirthday())
                .empPhoneNumber(request.getEmpPhoneNumber())
                .empAddress(request.getEmpAddress())
                .empDetailAddress(request.getEmpDetailAddress())
                .empGender(request.getEmpGender())
                .empStartDate(request.getEmpStartDate())
                .empStatus("재직")
                .build();
        empRepository.save(emp);
        Vacation vacation = Vacation.builder()
                .emp(emp)
                .vacationTotalVacation(18)
                .vacationUsedVacation(0)
                .vacationTotalDayOff(12)
                .vacationUsedDayOff(0)
                .build();
        vacationRepository.save(vacation);
    }

    @Transactional(readOnly = true)
    public SignInResponse signIn(SignInRequest request, HttpServletResponse httpResponse) {
        Emp emp = empRepository.findByEmpEmail(request.getEmpEmail())
                .orElseThrow(() -> new UsernameNotFoundException("이메일/비밀번호가 맞지않습니다."));
        String encPassword = emp.getPassword();
        boolean matches = passwordEncoder.matches(request.getPassword(), encPassword);
        if (!matches) {
            throw new UsernameNotFoundException("이메일/비밀번호가 맞지않습니다.");
        }

        String token = jwtProvider.createToken(emp.getEmpEmail(), emp.getAuthorities());
        List<String> roles = Arrays.stream(emp.getRoles().split(",")).toList();
        String encode = URLEncoder
                .encode("Bearer ", StandardCharsets.UTF_8)
                .replaceAll("\\+", "%20")
                + token;
        Cookie cookie = new Cookie("Authorization", encode);
        // cookie.setHttpOnly(true);
        // cookie.setSecure(true);
        cookie.setPath("/");

        httpResponse.addCookie(cookie);
        return SignInResponse.builder()
                .token(token)
                .empId(emp.getEmpId())
                .empName(emp.getEmpName())
                .empEmail(emp.getEmpEmail())
                .roles(roles)
                .build();
    }

    @Transactional(readOnly = true)
    public EmpDetailResponse empDetailResponse() {
        Emp emp = SecurityHelper.getAccount();

        return EmpDetailResponse.builder()
                .empName(emp.getEmpName())
                .dept(emp.getDept().getDeptName())
                .empPosition(emp.getEmpPosition())
                .empPhoneNumber(emp.getEmpPhoneNumber())
                .empBirthday(emp.getEmpBirthday())
                .empStartDate(emp.getEmpStartDate())
                .empAddress(emp.getEmpAddress())
                .empDetailAddress(emp.getEmpDetailAddress())
                .empEmail(emp.getEmpEmail())
                .password(emp.getPassword())
                .build();

    }

    @Transactional
    public Long passwordUpdate(EmpPasswordUpdateRequest request) {
        Emp emp = SecurityHelper.getAccount();
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        emp.updatePassword(encodedPassword);
        empRepository.save(emp);
        try {
            mailService.sendSimpleMessage(emp.getEmpEmail());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return emp.getEmpId();
    }

    @Transactional(readOnly = true)
    public List<EmpSalaryListResponse> getEmpList() {
        Emp emp = SecurityHelper.getAccount();
        List<Emp> list = empRepository.findAll();
        return list.stream()
                .map(emp1 -> EmpSalaryListResponse.builder()
                        .empId(emp1.getEmpId())
                        .empName(emp1.getEmpName())
                        .empPosition(emp1.getEmpPosition())
                        .empAmount(emp1.getEmpAmount())
                        .dept(emp1.getDept().getDeptName())
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public EmpMainResponse empMainResponse() {
        Emp emp = SecurityHelper.getAccount();
        return EmpMainResponse.builder()
                .empName(emp.getEmpName())
                .empPosition(emp.getEmpPosition())
                .build();
    }

    private Emp getEmpAccountId(Long id) {

        return empRepository.findByEmpId(id);
    }

//    private Emp getEmpListHandler(Long empId) {
//        return empRepository.findById(empId)
//                .filter(emp -> emp.getDept().getDeptName().equals("재무부"))
//                .orElseThrow(() -> new IllegalArgumentException("권한 없음."));
//    }

}
