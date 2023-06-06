const dbus = require('dbus-next');
const { Interface, method, signal } = dbus.interface;

const serviceName = 'org.freedesktop.Notifications';
const objectPath = '/org/freedesktop/Notifications';
const interfaceName = 'org.freedesktop.Notifications';

const bus = dbus.sessionBus();

class NotificationsInterface extends Interface {
  constructor() {
    super(interfaceName);
  }

  @method({ inSignature: 'susssasa{sv}i', outSignature: 'u' })
  Notify(appName, replacesId, appIcon, summary, body, actions, hints, timeout) {
    console.log("Notification received:");
    console.log(`  App: ${appName}`);
    console.log(`  Icon: ${appIcon}`);
    console.log(`  Summary: ${summary}`);
    console.log(`  Body: ${body}`);
    console.log(`  Actions: ${actions}`);
    console.log(`  Hints: ${hints}`);
    console.log(`  Timeout: ${timeout}`);

    this.notificationId = (this.notificationId || 0) + 1;
    return this.notificationId;
  }

  @method({ inSignature: 'u', outSignature: '' })
  CloseNotification(id) {
    console.log(`Close notification with ID: ${id}`);
    this.NotificationClosed(id, 0);
  }

  @method({ inSignature: '', outSignature: 'as' })
  GetCapabilities() {
    const capabilities = ["body", "icon-static", "actions", "persistence"];
    return capabilities;
  }

  @method({ inSignature: '', outSignature: 'ssss' })
  GetServerInformation() {
    const name = 'ShieldNotifications';
    const vendor = 'Shield';
    const version = '1.0';
    const specVersion = '1.2';

    return [name, vendor, version, specVersion];
  }

  @signal({ signature: 'uu' })
  NotificationClosed(id, reason) {
    return [id, reason];
  }

  @signal({ signature: 'us' })
  ActionInvoked(id, actionKey) {
    return [id, actionKey];
  }
}

async function main() {
  try {
    await bus.requestName(serviceName);
    const ifaceInstance = new NotificationsInterface();
    bus.export(objectPath, ifaceInstance);
    console.log(`Server started. Listening for notifications on ${serviceName} at ${objectPath}`);
  } catch (err) {
    console.error(`Error: ${err}`);
  }
}

main();
