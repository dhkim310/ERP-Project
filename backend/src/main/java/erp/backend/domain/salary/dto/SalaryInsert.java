package erp.backend.domain.salary.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SalaryInsert {
    private String bank;
    private String accountNumber;
    private int tax;
    private int bonus;
}
