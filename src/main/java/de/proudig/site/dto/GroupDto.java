package de.proudig.site.dto;

import java.time.Instant;

/** Kompakte Sicht auf eine Nutzergruppe. */
public record GroupDto(String id, String name, Instant createdAt, int memberCount) {
}
