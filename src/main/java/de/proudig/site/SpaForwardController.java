package de.proudig.site;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {
    @GetMapping(value = {"/", "/{path:^(?!api|static|assets|favicon\\.ico).*$}/**"})
    public String forward() {
        return "forward:/index.html";
    }
}
