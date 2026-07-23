package de.proudig.site.config;

import de.proudig.site.service.PageService;
import de.proudig.site.service.SettingService;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;
import org.springframework.scheduling.support.CronTrigger;

/**
 * Aktiviert Scheduling und registriert den News-Lebenszyklus-Job mit einem dynamischen
 * Trigger: Der Cron-Ausdruck wird bei jeder Ausführung frisch aus den Einstellungen gelesen,
 * sodass eine Änderung über die Admin-UI ohne Neustart wirkt.
 */
@Configuration
@EnableScheduling
public class NewsSchedulingConfig implements SchedulingConfigurer {

    private final PageService pageService;
    private final SettingService settingService;

    public NewsSchedulingConfig(PageService pageService, SettingService settingService) {
        this.pageService = pageService;
        this.settingService = settingService;
    }

    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
        taskRegistrar.addTriggerTask(
                pageService::runNewsLifecycle,
                triggerContext -> new CronTrigger(settingService.getNewsLifecycleCron()).nextExecution(triggerContext)
        );
    }
}
