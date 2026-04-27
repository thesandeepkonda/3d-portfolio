import React from 'react';
import * as THREE from 'three';

const EiffelTower = () => {
    React.useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const geometry = new THREE.CylinderGeometry(1, 1, 5, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const tower = new THREE.Mesh(geometry, material);

        scene.add(tower);

        camera.position.z = 10;

        const animate = function () {
            requestAnimationFrame(animate);
            tower.rotation.y += 0.01;
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            document.body.removeChild(renderer.domElement);
        };
    }, []);

    return <div />;
};

export default EiffelTower;