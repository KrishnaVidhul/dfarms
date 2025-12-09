# main.tf

# 1. PROVIDER CONFIGURATION
provider "google" {
  project = var.project_id
  region  = "us-central1"
  zone    = "us-central1-a" # Free tier eligible zone
}

# 2. VARIABLES
variable "project_id" {
  description = "Your Google Cloud Project ID"
}

variable "github_repo" {
  description = "Your GitHub Repo URL (e.g., https://github.com/KrishnaVidhul/dfarms.git)"
  default     = "https://github.com/KrishnaVidhul/dfarms.git"
}

variable "github_token" {
  description = "GitHub Personal Access Token"
  sensitive   = true
}

variable "supabase_url" {
  description = "Database Connection URL"
  sensitive   = true
}

variable "groq_api_key" {
  description = "Groq LPU API Key"
  sensitive   = true
}

# 3. NETWORK FIREWALL (Allow Public Access)
resource "google_compute_firewall" "allow_http" {
  name    = "allow-http-dfarms"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["80", "3000"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["http-server"]
  depends_on    = [google_project_service.compute_api]
}

# 3.5 ENABLE COMPUTE API
resource "google_project_service" "compute_api" {
  project = var.project_id
  service = "compute.googleapis.com"

  disable_on_destroy = false
}

# 4. THE FREE TIER VM (e2-micro)
resource "google_compute_instance" "dfarms_server" {
  name                      = "dfarms-erp-prod"
  machine_type              = "e2-micro" # Upgraded for speed (2 vCPU, 4GB RAM)
  zone                      = "us-central1-a"
  allow_stopping_for_update = true
  depends_on                = [google_project_service.compute_api]

  # Optimization: Use Spot/Preemptible for even lower cost (optional)
  # scheduling {
  #   preemptible = true
  #   automatic_restart = false
  # }

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2204-lts"
      size  = 30 # Max free tier size
      type  = "pd-standard"
    }
  }

  network_interface {
    network = "default"
    access_config {
      # Ephemeral public IP
    }
  }

  tags = ["http-server", "https-server"]

  # 5. THE STARTUP SCRIPT (Automated Deployment)
  metadata_startup_script = <<-EOT
    #!/bin/bash
    
    # --- A. SWAP MEMORY HACK (CRITICAL) ---
    fallocate -l 4G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab

    # --- B. INSTALL DOCKER & GIT ---
    apt-get update
    apt-get install -y docker.io docker-compose git

    # --- C. CLONE REPOSITORY (Fresh Start) ---
    rm -rf /app
    mkdir -p /app
    cd /app
    
    CLEAN_REPO_URL=$(echo "${var.github_repo}" | sed 's~http[s]*://~~g')
    git clone https://oauth2:${var.github_token}@$CLEAN_REPO_URL .

    # --- D. CONFIGURE ENVIRONMENT ---
    # 1. Root .env for docker-compose
    cat <<EOF > .env
    # App Config
    DATABASE_URL="${var.supabase_url}"
    GROQ_API_KEY="${var.groq_api_key}"
    NODE_ENV=production
    GITHUB_TOKEN="${var.github_token}"
    
    # Local DB Config (Required by docker-compose even if using Supabase)
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=password
    POSTGRES_DB=dfarms_db
    EOF

    # 2. Agent Runtime .env
    # Ensure directory exists just in case
    mkdir -p src/agent_runtime
    cp .env src/agent_runtime/.env

    # --- E. START THE FACTORY ---
    docker-compose down || true
    docker-compose up -d --build

  EOT
}

# 6. OUTPUT THE IP
output "server_ip" {
  value       = google_compute_instance.dfarms_server.network_interface.0.access_config.0.nat_ip
  description = "Access your ERP at this IP address (Port 3000)"
}
