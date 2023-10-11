package erp.backend.domain.salary.controller;

import erp.backend.domain.emp.entity.Emp;
import erp.backend.domain.emp.service.EmpService;
import erp.backend.domain.salary.dto.SalaryInsert;
import erp.backend.domain.salary.service.SalaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/salary")
public class SalaryController {

    private final SalaryService salaryService;

    @PostMapping("/insert")
    public ResponseEntity<Long> salaryInsert(@RequestBody SalaryInsert request){
        return ResponseEntity.ok(salaryService.salaryInsert(request));
    }
}
