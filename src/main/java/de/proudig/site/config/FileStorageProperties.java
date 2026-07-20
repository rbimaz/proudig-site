package de.proudig.site.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "filestorage")
public class FileStorageProperties {
    private String location;

    public FileStorageProperties() {
    }

    public String getLocation() {
        return this.location;
    }

    public void setLocation(final String location) {
        this.location = location;
    }

    @java.lang.Override
    public boolean equals(final java.lang.Object o) {
        if (o == this) return true;
        if (!(o instanceof FileStorageProperties)) return false;
        final FileStorageProperties other = (FileStorageProperties) o;
        if (!other.canEqual((java.lang.Object) this)) return false;
        final java.lang.Object this$location = this.getLocation();
        final java.lang.Object other$location = other.getLocation();
        if (this$location == null ? other$location != null : !this$location.equals(other$location)) return false;
        return true;
    }

    protected boolean canEqual(final java.lang.Object other) {
        return other instanceof FileStorageProperties;
    }

    @java.lang.Override
    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final java.lang.Object $location = this.getLocation();
        result = result * PRIME + ($location == null ? 43 : $location.hashCode());
        return result;
    }

    @java.lang.Override
    public java.lang.String toString() {
        return "FileStorageProperties(location=" + this.getLocation() + ")";
    }
}
