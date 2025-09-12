FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5006

ENV ASPNETCORE_URLS=http://+:5006

FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG configuration=Release
WORKDIR /src
COPY backend/*.csproj ./backend/
RUN dotnet restore ./backend/TaskApi.csproj
COPY backend ./backend
WORKDIR /src/backend
RUN dotnet build "TaskApi.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "TaskApi.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TaskApi.dll"]


# cd backend
# docker build -t task-backend .
# docker run -p 5006:5006 task-backend
#docker-compose up --build