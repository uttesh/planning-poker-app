# planning-poker-app

Jira sprint story points planning in the team, app allow the team member to provide the points

## Build frontend

```
> yarn install
> yarn build
```

## Build backend

```
> yarn install
> yarn build
```

## docker build and run

```
> docker build -t planning-poker-app .
> docker run -p 80:80 -p 3001:3001 planning-poker-app

```

## Access the Application

Once the container is running, you can access the application by navigating to http://localhost.

The frontend will be served directly.
Any requests to /api/ will be proxied to the backend API running inside the Docker Compose network.
