# Start from a NGINX ready container
FROM nginx
# Create cache folder
RUN mkdir -p /opt/ldf-cache
# Copy NGINX config files
COPY . /etc/nginx