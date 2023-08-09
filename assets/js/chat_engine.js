class ChatEngine {
    constructor(chatBoxId, userEmail) {
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        this.socket = io.connect("http://localhost:5000");

        if (this.userEmail) {
            this.connectionHandler();
        }
    }

    connectionHandler() {
        let self = this;

        this.socket.on("connect", function () {
            console.log("connection established using sockets.....");

              self.socket.emit("join_room", {
                user_email: self.userEmail,
                chatroom: "Geeta-Gyan",
        });

              self.socket.on("user_joined", function (data) {
                console.log("a user joined!", data);
              });
            });

            $("#send-message").click(function () {
              let msg = $("#chat-message-input").val();

              if (msg != "") {
                self.socket.emit("send_message", {
                  message: msg,
                  user_email: self.userEmail,
                  chatroom: "Geeta-Gyan",
                });
              }
            });

            self.socket.on("receive_message", function (data) {
              console.log("message received", data.message);

              let newMessage = $("<li>");

              let messageType = "other-message";

              if (data.user_email == self.userEmail) {
                messageType = "self-message";
              }

              newMessage.append(
                  $("<p>", {
                    class: "small mb-1",
                      html: data.user_email,
                  style: "font-weight: bold;"
                })
              );
              newMessage.append(
                  $("<p>", {
                      html: data.message,
                class :"small p-2 ms-3 mb-3 rounded-3",
                style:"background-color: #f5f6f7"
                })
              );


              newMessage.addClass(messageType);

              $("#chat-messages-list").append(newMessage);
            });
          }
};

