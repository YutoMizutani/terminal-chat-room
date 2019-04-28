# Project name
PROJECT_NAME_SERVER=terminal-chat-room-server
PROJECT_NAME_CLIENT=terminal-chat-room-client

# Path
PROJECT_PATH=.
SERVER_PATH=$(PROJECT_PATH)/$(PROJECT_NAME_SERVER)
CLIENT_PATH=$(PROJECT_PATH)/$(PROJECT_NAME_CLIENT)


# Run
run-server:
	cd $(SERVER_PATH); \
	node app.js
run-client:
	make run-client-electron
run-client-electron:
	cd $(CLIENT_PATH); \
	npm run electron
run-client-angular:
	cd $(CLIENT_PATH); \
	ng serve --open