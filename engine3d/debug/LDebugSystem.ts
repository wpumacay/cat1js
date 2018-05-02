

/// <reference path="../../core/math/LMath.ts" />
/// <reference path="LDebugDrawer.ts" />



namespace engine3d
{

    export namespace DebugSystem
    {

        export function init() : void
        {
            LDebugDrawer.create();
        };

        export function drawLine( start : core.LVec3, end : core.LVec3, color : core.LVec3 ) : void
        {
            LDebugDrawer.INSTANCE.drawLine( start, end, color );
        }

        export function drawArrow( start : core.LVec3, end : core.LVec3, color : core.LVec3 ) : void
        {
            LDebugDrawer.INSTANCE.drawArrow( start, end, color );
        }

        export function drawFrame( frameMat : core.LMat4, axisSize : number ) : void
        {
            LDebugDrawer.INSTANCE.drawFrame( frameMat, axisSize );
        }

        export function begin( viewMatrix : core.LMat4, projMatrix : core.LMat4 ) : void
        {
            LDebugDrawer.INSTANCE.setupMatrices( viewMatrix, projMatrix );
        }

        export function render() : void
        {
            LDebugDrawer.INSTANCE.render();
        }

        export function release() : void
        {
            LDebugDrawer.release();
        }
        
    }

}