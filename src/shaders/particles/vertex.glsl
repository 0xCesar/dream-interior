uniform vec2 uResolution;
uniform float uSize;

uniform float uAngle;
uniform float uRadius;

varying vec2 vUV;

void main()
{

  //vUV = uv;

        // Transform vertex position
        vec3 newPosition = position;

        // Calculate angle from the center of the plane
        float angle = atan(newPosition.z, newPosition.x);

        // Calculate distance from the center of the plane
        float distance = length(newPosition.xz);

        // Apply twist around the center of the plane
        angle += uAngle;

        // Calculate new position after twist
        float x = cos(angle) * distance;

        float z = sin(angle) * distance;
      // newPosition.x = x;
       newPosition.z = z;
      //   newPosition.x = x;

    // Final position
    /*vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;*/
   // gl_Position = projectedPosition;

        // Set the final position
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
   
}