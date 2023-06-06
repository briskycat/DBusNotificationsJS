const dbus = require('@httptoolkit/dbus-native');

const serviceName = 'org.freedesktop.Notifications';
const objectPath = '/org/freedesktop/Notifications';
const interfaceName = 'org.freedesktop.Notifications';

const ifaceDesc = {
  name: interfaceName,
  methods: {
    Notify: ['s', 'u', 's', 's', 's', 'as', 'a{sv}', 'i', 'u'],
    CloseNotification: ['u', ''],
    GetCapabilities: ['', 'as'],
  },
  signals: {
    NotificationClosed: ['u', 'u'],
    ActionInvoked: ['u', 's'],
  },
};

const bus = dbus.sessionBus();

bus.requestName(serviceName, 0, (err, retCode) => {
  if (err) {
    console.error(`Error requesting name ${serviceName}: ${err}`);
    return;
  }
  if (retCode === 1) {
    console.log(`Successfully obtained name ${serviceName}`);
  } else {
    console.error(`Failed to obtain name ${serviceName}, return code: ${retCode}`);
    return;
  }
});

let notificationId = 0;

const iface = {
  Notify: function (appName, replacesId, appIcon, summary, body, actions, hints, timeout) {
    console.log("Notification received:");
    console.log(`  App: ${appName}`);
    console.log(`  Icon: ${appIcon}`);
    console.log(`  Summary: ${summary}`);
    console.log(`  Body: ${body}`);
    console.log(`  Actions: ${actions}`);
    console.log(`  Hints: ${hints}`);
    console.log(`  Timeout: ${timeout}`);

    notificationId++;
    return notificationId;
  },
  CloseNotification: function (id) {
    console.log(`Close notification with ID: ${id}`);
    iface.NotificationClosed(id, 0);
  },
  GetCapabilities: function () {
    const capabilities = ["body", "icon-static", "actions", "persistence"];
    return capabilities;
  },
};

bus.exportInterface(iface, objectPath, ifaceDesc);
console.log(`Server started. Listening for notifications on ${serviceName} at ${objectPath}`);
