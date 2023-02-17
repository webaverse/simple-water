
import * as THREE from 'three';

const localVector2D = new THREE.Vector2();

export default (ctx) => {
  const { useApp, useFrame, useLocalPlayer } = ctx;
  const app = useApp();
  const localPlayer = useLocalPlayer();

  useFrame(({ timestamp }) => {
    localVector2D.x = localPlayer.position.x;
    localVector2D.y = localPlayer.position.z;
    if (localVector2D.length() > 3) {
      if (!localPlayer.actionManager.hasActionType('swim')) {
        const newSwimAction = {type: 'swim'};
        localPlayer.actionManager.addAction(newSwimAction);
      }
    } else {
      if (localPlayer.actionManager.hasActionType('swim')) {
        localPlayer.actionManager.removeActionType('swim');
      }
    }
  });

  app.setComponent('renderPriority', 'low');

  return app;
};