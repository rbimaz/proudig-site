package de.proudig.site.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCreateRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String company;
    private Set<String> roles;
}
