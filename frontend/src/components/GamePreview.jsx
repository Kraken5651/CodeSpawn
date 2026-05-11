import React, { useEffect, useRef, useState } from 'react';

const GamePreview = ({ scene, lastSubmission }) => {
  const canvasRef = useRef(null);
  const [images, setImages] = useState({});

  useEffect(() => {
    const paths = {
      knight: '/assets/sprites/knight.png',
      slime: '/assets/sprites/slime.png',
      monster_ball: '/assets/sprites/monster_ball.png',
    };
    const loaded = {};
    Object.entries(paths).forEach(([key, path]) => {
      const img = new Image();
      img.src = path;
      img.onload = () => loaded[key] = img;
    });
    setImages(loaded);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Local Simulation State
    let px = scene.initialX || 50;
    let py = 150;
    let targetX = scene.targetX || 50;
    let jumpY = 0;
    let isJumping = false;
    let gateOpen = false;
    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Environment
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      for(let i=0; i<canvas.width; i+=40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      }

      // Ground
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 180, canvas.width, 20);

      // 2. Simulation Logic
      if (lastSubmission?.passed) {
        if (scene.type === 'move') {
          if (px < targetX) px += 3;
        }
        if (scene.type === 'animation') {
          px += scene.delta;
          if (px > canvas.width) px = -20;
        }
        if (scene.type === 'gate-logic') {
          gateOpen = true;
        }
        if (scene.type === 'input-test' && scene.action === 'Jump') {
          isJumping = true;
        }
        if (scene.type === 'loop') {
          px = 50 + (frame % 300); // Loop movement
        }
      }

      // Handle Jump Animation
      if (isJumping) {
        jumpY = Math.sin(frame * 0.1) * 50;
        if (jumpY < 0) { jumpY = 0; isJumping = false; }
      }

      // 3. Draw Scene Specifics
      if (scene.type === 'gate-logic') {
        ctx.fillStyle = gateOpen ? '#00ffa3' : '#ff4444';
        ctx.fillRect(350, 80, 10, 100);
        ctx.fillStyle = '#fff';
        ctx.font = '10px monospace';
        ctx.fillText(gateOpen ? "OPEN" : "LOCKED", 340, 70);
      }

      if (scene.type === 'array') {
        for (let i = 0; i < 5; i++) {
          ctx.fillStyle = (lastSubmission?.passed && i < scene.fillCount) ? '#00ffa3' : '#333';
          ctx.fillRect(100 + i * 40, 120, 30, 30);
          ctx.fillStyle = '#fff';
          ctx.font = '12px Inter';
          ctx.fillText(`[${i}]`, 105 + i * 40, 165);
        }
      }

      if (scene.type === 'collision') {
        ctx.fillStyle = '#ff6b6b';
        let enemyX = 300 - (lastSubmission?.passed ? px * 0.5 : 0);
        ctx.fillRect(enemyX, py - 30, 30, 30);
        if (lastSubmission?.passed && px + 20 >= enemyX) {
           ctx.fillStyle = '#ffde57';
           ctx.beginPath();
           ctx.arc(enemyX, py - 15, 40 + Math.sin(frame*0.5)*10, 0, Math.PI*2);
           ctx.fill();
        }
      }
      
      if (scene.type === 'instantiate' && lastSubmission?.passed) {
         for (let i = 0; i < 10; i++) {
            ctx.fillStyle = '#00ffa3';
            let bx = px + (frame * 5 + i * 20) % 400;
            ctx.fillRect(bx, py - 20 - (i*5), 10, 10);
         }
      }

      if (scene.type === 'raycast' && lastSubmission?.passed) {
         ctx.strokeStyle = '#ff4444';
         ctx.lineWidth = 2;
         ctx.beginPath();
         ctx.moveTo(px, py - 25);
         ctx.lineTo(px + 200, py - 25);
         ctx.stroke();
         ctx.fillStyle = '#ff4444';
         ctx.fillRect(px + 200, py - 35, 20, 20); // target hit
      }

      // 4. Draw Player
      if (scene.type !== 'array') {
        const sprite = images[scene.playerSprite];
        const bounce = Math.sin(frame * 0.15) * 2;
        if (sprite) {
          ctx.drawImage(sprite, px - 25, py - 50 - jumpY + bounce, 50, 50);
        } else {
          ctx.fillStyle = '#00ffa3';
          ctx.fillRect(px - 15, py - 30 - jumpY + bounce, 30, 30);
        }
      }

      // 5. HUD Overlay
      if (scene.label) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Inter';
        ctx.fillText(scene.label.replace('0', lastSubmission?.passed ? (scene.targetVal || '100') : '0'), px - 20, py - 70 - jumpY);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [scene, lastSubmission, images]);

  return (
    <div className="game-preview-container">
      <canvas 
        ref={canvasRef} 
        width={450} 
        height={220} 
        className="simulation-canvas"
      />
    </div>
  );
};

export default GamePreview;
