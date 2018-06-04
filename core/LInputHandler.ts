

/// <reference path="math/LMath.ts" />


namespace core
{

    export const KEY_W      : number = 87;
    export const KEY_A      : number = 65;
    export const KEY_S      : number = 83;
    export const KEY_D      : number = 68;
    export const KEY_UP     : number = 38;
    export const KEY_DOWN   : number = 40;
    export const KEY_LEFT   : number = 37;
    export const KEY_RIGHT  : number = 39;
    export const KEY_SPACE  : number = 32;
    export const KEY_ESCAPE : number = 27;
    export const KEY_ENTER  : number = 13;

    export const MAX_KEYS : number = 1024;

    export const MOUSE_LEFT : number = 0;
    export const MOUSE_WHEEL : number = 1;
    export const MOUSE_RIGHT : number = 2;

    export const MOUSE_UP : number = 0;
    export const MOUSE_DOWN : number = 1;

    export const WHEEL_ACUM_RATIO : number = 0.01;

    export class LInputHandler
    {

        private static INSTANCE : LInputHandler = null;

        private m_canvas : HTMLCanvasElement;
        private m_cursor : LVec2;
        private m_mouseStates : { [id:number] : number };
        private m_isMouseDown : boolean;
        private m_keys : number[];
        private m_wheelDelta : core.LVec3;
        private m_wheelAcumValue : number;

        private m_mouseDownCallback : Function;
        private m_mouseUpCallback : Function;
        private m_mouseMoveCallback : Function;

        constructor( canvas : HTMLCanvasElement )
        {
            this.m_canvas = canvas;
            this.m_cursor = new LVec2( 0, 0 );
            this.m_mouseStates = { 0 : MOUSE_UP,
                                   1 : MOUSE_UP,
                                   2 : MOUSE_UP };
            this.m_isMouseDown = false;
            this.m_keys = [];

            let q : number;
            for ( q = 0; q < MAX_KEYS; q++ )
            {
                this.m_keys[ q ] = 0;
            }

            this.m_wheelDelta = new core.LVec3( 0, 0, 0 );
            this.m_wheelAcumValue = 0;

            this.m_mouseDownCallback = null;
            this.m_mouseUpCallback = null;
            this.m_mouseMoveCallback = null;

            this._registerEvents();
        }

        private _registerEvents() : void
        {
            this.m_canvas.onmousedown = LInputHandler.onMouseDown;
            this.m_canvas.onmousemove = LInputHandler.onMouseMove;
            this.m_canvas.onmouseup = LInputHandler.onMouseUp;

            document.addEventListener( 'keydown', LInputHandler.onKeyDown );
            document.addEventListener( 'keyup', LInputHandler.onKeyUp );
            document.addEventListener( 'wheel', LInputHandler.onWheelEvent );
        }

        private _isKeyPressed( keyId : number ) : boolean 
        { 
            if ( keyId < 0 || keyId >= MAX_KEYS )
            {
                console.warn( 'LInputHandler> requesting key ' +
                              keyId + ' which is out of range' );
                return false;
            }

            return ( this.m_keys[ keyId ] == 1 );
        }


        public static init( canvas : HTMLCanvasElement ) : void
        {
            LInputHandler.INSTANCE = new LInputHandler( canvas );
        }

        public static wheelAcumValue() : number { return LInputHandler.INSTANCE.m_wheelAcumValue; }
        public static cursorXY() : LVec2 { return LInputHandler.INSTANCE.m_cursor.clone(); }
        public static isKeyPressed( keyId : number ) : boolean { return LInputHandler.INSTANCE._isKeyPressed( keyId ); }
        public static isMouseDown() : boolean { return LInputHandler.INSTANCE.m_isMouseDown; }

        public static isMouseButtonDown( buttonId : number ) : boolean
        {
            if ( 0 > buttonId || buttonId > MOUSE_RIGHT )
            {
                console.warn( 'LInputHandler> button requested: ' + buttonId + ' does not exist' );
                return false;
            }

            return LInputHandler.INSTANCE.m_mouseStates[ buttonId ] == MOUSE_DOWN;
        }

        public static isMouseButtonUp( buttonId : number ) : boolean
        {
            if ( 0 > buttonId || buttonId > MOUSE_RIGHT )
            {
                console.warn( 'LInputHandler> button requested: ' + buttonId + ' does not exist' );
                return false;
            }

            return LInputHandler.INSTANCE.m_mouseStates[ buttonId ] == MOUSE_UP;
        }

        /**
        * Event callbacks
        */
        public static onKeyDown( ev : KeyboardEvent ) : void
        {
            // console.info( 'key: ' + ev.key );
            // console.info( 'keyCode: ' + ev.keyCode );

            let _self : LInputHandler = LInputHandler.INSTANCE;
            let _key : number = ev.keyCode;

            _self.m_keys[ _key ] = 1;
        }

        public static onKeyUp( ev : KeyboardEvent ) : void
        {
            // console.info( 'key: ' + ev.key );
            // console.info( 'keyCode: ' + ev.keyCode );

            let _self : LInputHandler = LInputHandler.INSTANCE;
            let _key : number = ev.keyCode;

            _self.m_keys[ _key ] = 0;
        }

        public static onWheelEvent( ev : WheelEvent ) : void
        {
            let _self : LInputHandler = LInputHandler.INSTANCE;

            _self.m_wheelDelta.x = ev.deltaX;
            _self.m_wheelDelta.y = ev.deltaY;
            _self.m_wheelDelta.z = ev.deltaZ;

            // check which direction is the one that has actual value
            _self.m_wheelAcumValue -= ( _self.m_wheelDelta.x + 
                                        _self.m_wheelDelta.y +
                                        _self.m_wheelDelta.z ) * WHEEL_ACUM_RATIO;
        }

        public static onMouseDown( ev : MouseEvent ) : void
        {
            // console.info( 'MouseDown> ev.x: ' + ev.x + " - ev.y: " + ev.y );

            let _self : LInputHandler = LInputHandler.INSTANCE;

            _self.m_isMouseDown = true;
            _self.m_cursor.x = ev.x;
            _self.m_cursor.y = ev.y;

            _self.m_mouseStates[ ev.button ] = MOUSE_DOWN;
        }

        public static onMouseUp( ev : MouseEvent ) : void
        {
            // console.info( 'MouseUp> ev.x: ' + ev.x + " - ev.y: " + ev.y );

            let _self : LInputHandler = LInputHandler.INSTANCE;

            _self.m_isMouseDown = false;
            _self.m_cursor.x = ev.x;
            _self.m_cursor.y = ev.y;

            _self.m_mouseStates[ ev.button ] = MOUSE_UP;
        }

        public static onMouseMove( ev : MouseEvent ) : void
        {
            // console.info( 'MouseMove> ev.x: ' + ev.x + " - ev.y: " + ev.y );

            let _self : LInputHandler = LInputHandler.INSTANCE;

            _self.m_cursor.x = ev.x;
            _self.m_cursor.y = ev.y;
        }

    }
    
}
