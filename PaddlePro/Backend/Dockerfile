FROM node

RUN groupadd -r myuser && useradd -r -g myuser -d /app -s /sbin/nologin -c "Docker image user" myuser
WORKDIR /app
COPY . /app
RUN npm i
RUN chmod +x starter.sh
RUN chown -R myuser:myuser /app
EXPOSE 4000 5555
USER myuser
# RUN chmod -R 777 /app
ENTRYPOINT ["bash", "./starter.sh"]