"use client"

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Float, MeshTransmissionMaterial } from '@react-three/drei'
import { motion } from 'framer-motion-3d'
import { useSpring, animated } from '@react-spring/three'

interface Skill {
  name: string;
  level: number;
}

interface SkillBadgeProps {
  skill: Skill;
  index: number;
}

function SkillBadge({ skill, index }: SkillBadgeProps) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef<any>(null)
  
  // 计算位置（更紧凑的圆形布局）
  const radius = 3
  const angle = index * (Math.PI * 2) / 8
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius
  
  // 弹性动画
  const { scale, rotation, color } = useSpring({
    scale: hovered ? 1.3 : 1,
    rotation: hovered ? [0, Math.PI * 2, 0] : [0, 0, 0],
    color: hovered ? "#4f46e5" : "#6366f1",
    config: { mass: 2, tension: 300, friction: 40 }
  })

  // 持续轻微旋转
  useFrame((state) => {
    if (meshRef.current && !hovered) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2 + index
    }
  })
  
  return (
    <Float
      speed={2} // 动画速度
      rotationIntensity={0.5} // 旋转强度
      floatIntensity={0.5} // 浮动强度
    >
      <animated.mesh
        ref={meshRef}
        position={[x, 0, z]}
        scale={scale}
        rotation={rotation}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        {/* 使用更高级的材质 */}
        <sphereGeometry args={[0.8, 32, 32]} />
        <animated.meshStandardMaterial 
          color={color} 
          metalness={0.5}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
        
        {/* 悬停时显示技能详情 */}
        {hovered && (
          <>
            <Text
              position={[0, 1.5, 0]}
              fontSize={0.35}
              color="white"
              anchorX="center"
              anchorY="middle"
              maxWidth={2}
              outlineWidth={0.02}
              outlineColor="#000000"
            >
              {skill.name}
            </Text>
            <Text
              position={[0, 1.0, 0]}
              fontSize={0.3}
              color="white"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.01}
              outlineColor="#000000"
            >
              {`熟练度: ${skill.level}%`}
            </Text>
          </>
        )}
        
        {/* 默认情况下只显示技能名称 */}
        <Text
          position={[0, 0, 0.85]}
          fontSize={0.22}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.5}
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {skill.name}
        </Text>
      </animated.mesh>
    </Float>
  )
}

interface SkillCubeProps {
  skills: Skill[];
}

export default function SkillCube({ skills }: SkillCubeProps) {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 2, 12], fov: 35 }}>
      <color attach="background" args={['transparent']} />
      <fog attach="fog" args={['#f5f5f9', 5, 20]} />
      <ambientLight intensity={0.5} />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {/* 地面反射 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#f3f4f6" 
          transparent
          opacity={0.5}
          roughness={0.5}
        />
      </mesh>
      
      {/* 显示最多8个技能 */}
      {skills.slice(0, 8).map((skill, index) => (
        <SkillBadge key={index} skill={skill} index={index} />
      ))}
    </Canvas>
  )
} 