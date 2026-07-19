package de.proudig.site.controller;

import de.proudig.site.domain.Page;
import de.proudig.site.domain.PageCategory;
import de.proudig.site.domain.PageStatus;
import de.proudig.site.repository.PageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rss")
@RequiredArgsConstructor
public class RssFeedController {
    private final PageRepository pageRepository;

    @GetMapping(value = "/blog", produces = MediaType.APPLICATION_RSS_XML_VALUE)
    public ResponseEntity<String> getBlogFeed() {
        try {
            Pageable pageable = PageRequest.of(0, 50, Sort.by(Sort.Direction.DESC, "publishedAt"));
            var blogPosts = pageRepository.findByCategoryAndStatus(
                    PageCategory.BLOG, PageStatus.PUBLISHED, pageable);

            String rssContent = generateRssFeed(
                    blogPosts.getContent(),
                    "ProuDig Blog",
                    "https://proudig.de/blog",
                    "Latest blog posts from ProuDig"
            );

            return ResponseEntity.ok(rssContent);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private String generateRssFeed(java.util.List<Page> pages, String title, String link, String description) {
        StringBuilder rss = new StringBuilder();

        rss.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        rss.append("<rss version=\"2.0\">\n");
        rss.append("  <channel>\n");
        rss.append("    <title>").append(escapeXml(title)).append("</title>\n");
        rss.append("    <link>").append(escapeXml(link)).append("</link>\n");
        rss.append("    <description>").append(escapeXml(description)).append("</description>\n");
        rss.append("    <language>en-us</language>\n");

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE, dd MMM yyyy HH:mm:ss Z");

        for (Page page : pages) {
            rss.append("    <item>\n");
            rss.append("      <title>").append(escapeXml(page.getTitle())).append("</title>\n");
            rss.append("      <link>https://proudig.de/blog/").append(escapeXml(page.getSlug())).append("</link>\n");
            rss.append("      <description>").append(escapeXml(page.getExcerpt() != null ? page.getExcerpt() : page.getTitle())).append("</description>\n");

            if (page.getPublishedAt() != null) {
                String pubDate = page.getPublishedAt().toString();
                rss.append("      <pubDate>").append(pubDate).append("</pubDate>\n");
            }

            rss.append("      <guid>https://proudig.de/blog/").append(escapeXml(page.getSlug())).append("</guid>\n");

            if (!page.getTagsList().isEmpty()) {
                for (String tag : page.getTagsList()) {
                    rss.append("      <category>").append(escapeXml(tag)).append("</category>\n");
                }
            }

            rss.append("    </item>\n");
        }

        rss.append("  </channel>\n");
        rss.append("</rss>");

        return rss.toString();
    }

    private String escapeXml(String input) {
        if (input == null) {
            return "";
        }
        return input
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&apos;");
    }
}
