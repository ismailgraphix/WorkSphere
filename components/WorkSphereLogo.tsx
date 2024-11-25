import React from 'react'

interface WorkSphereLogoProps {
  isCollapsed: boolean
  primaryColor?: string
  secondaryColor?: string
  textColor?: string
}

export default function WorkSphereLogo({
  isCollapsed,
  primaryColor = "#4F46E5",
  secondaryColor = "#818CF8",
  textColor = "#FFFFFF"
}: WorkSphereLogoProps) {
  return (
    <svg
      width={isCollapsed ? 40 : 180}
      height={isCollapsed ? 40 : 90}
      viewBox="0 0 200 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby="workSphereLogoTitle workSphereLogoDesc"
      role="img"
    >
      <title id="workSphereLogoTitle">WorkSphere Logo</title>
      <desc id="workSphereLogoDesc">
        A modern logo for WorkSphere featuring interconnected circles representing a network or sphere of work
      </desc>
      
      {/* Main circle */}
      <circle cx="50" cy="50" r="45" fill={primaryColor} />
      
      {/* Intersecting circles */}
      <circle cx="85" cy="50" r="35" fill={secondaryColor} opacity="0.8" />
      <circle cx="70" cy="80" r="30" fill={secondaryColor} opacity="0.6" />
      
      {/* WorkSphere text */}
      {!isCollapsed && (
        <>
          <text
            x="110"
            y="60"
            fontFamily="Arial, sans-serif"
            fontSize="24"
            fontWeight="bold"
            fill={textColor}
          >
            Work
          </text>
          <text
            x="110"
            y="90"
            fontFamily="Arial, sans-serif"
            fontSize="24"
            fontWeight="bold"
            fill={textColor}
          >
            Sphere
          </text>
        </>
      )}
    </svg>
  )
}