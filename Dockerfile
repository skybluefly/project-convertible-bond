FROM nginx

COPY ./dist/ /usr/share/nginx/html/
RUN rm /etc/nginx/conf.d/*
COPY ./vhost.nginx.conf /etc/nginx/conf.d/vhost.nginx.conf

EXPOSE 80

ENTRYPOINT ["nginx","-g","daemon off;"]