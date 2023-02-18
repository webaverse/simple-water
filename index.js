
import * as THREE from 'three';

const localVector2D = new THREE.Vector2();

export default (ctx) => {
  const { useApp, useFrame, useLocalPlayer, usePhysics, useCleanup } = ctx;
  const app = useApp();
  const localPlayer = useLocalPlayer();
  const physics = usePhysics();

  const geometry = new THREE.TorusGeometry( 7, 3, 6, 100 );
  geometry.rotateX(Math.PI / 2);
  geometry.scale(3, 1, 3);
  const material = new THREE.MeshStandardMaterial( { color: new THREE.Color(`rgb(164, 93, 37)`), flatShading: true } );
  const torus = new THREE.Mesh( geometry, material );
  torus.position.y = -3;
  app.add( torus );

  const physicsObject = physics.addGeometry(torus);

  {
    const geometry = new THREE.PlaneGeometry( 1000, 1000 );
    geometry.rotateX(Math.PI / 2);
    const material = new THREE.MeshStandardMaterial( {color: 'cyan', opacity: 0.5, transparent: true, side: THREE.DoubleSide} );
    const water = new THREE.Mesh( geometry, material );
    water.position.y = -1.3;
    app.add( water );
  }

  useFrame(({ timestamp }) => {
    // localVector2D.x = localPlayer.position.x;
    // localVector2D.y = localPlayer.position.z;
    // if (localVector2D.length() > 3) {
    if (localPlayer.position.y <= -1) { // todo: use constant or detect current water height.
      if (!localPlayer.actionManager.hasActionType('swim')) {
        const newSwimAction = {type: 'swim'};
        localPlayer.actionManager.addAction(newSwimAction);
        localPlayer.actionManager.hasActionType('fallLoop') && localPlayer.actionManager.removeActionType('fallLoop');
        localPlayer.actionManager.hasActionType('skydive') && localPlayer.actionManager.removeActionType('skydive');
        localPlayer.actionManager.hasActionType('glider') && localPlayer.actionManager.removeActionType('glider');
      }
    } else {
      localPlayer.actionManager.hasActionType('swim') && localPlayer.actionManager.removeActionType('swim');
    }
    // if (localPlayer.position.y >= -1.01) {
    //   if (!localPlayer.actionManager.hasActionType('onWaterSurface')) {
    //     const newOnWaterSurfaceAction = {type: 'onWaterSurface'};
    //     localPlayer.actionManager.addAction(newOnWaterSurfaceAction);
    //   }
    // } else {
    //   localPlayer.actionManager.hasActionType('onWaterSurface') && localPlayer.actionManager.removeActionType('onWaterSurface');
    // }
  });
  
  useCleanup(() => {
    physics.removeGeometry(physicsObject);
  });

  app.setComponent('renderPriority', 'low');

  return app;
};