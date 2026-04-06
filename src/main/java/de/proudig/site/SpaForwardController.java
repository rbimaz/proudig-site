package de.proudig.site;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {
    /**
     * SPA-Fallback: Leitet nur reine Pfade (ohne Dateiendung) auf index.html weiter,
     * damit React Router Routen wie /impressum übernimmt.
     *
     * Ausgeschlossen:
     *   - /api/**                (REST-Endpunkte)
     *   - Pfade mit Punkt        (statische Dateien: .js, .css, .html, .ico, .svg, ...)
     *   - /assets/**             (Vite Build-Output)
     *   - /team/**               (SVG-Avatare)
     *   - /static/**             (static resources)
     */
    @GetMapping({
        "/{path:^(?!api|assets|team|static)[^.]*$}",
        "/{path:^(?!api|assets|team|static)[^.]*$}/**"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
