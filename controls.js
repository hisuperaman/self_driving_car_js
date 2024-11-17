class Controls {
    constructor(carType) {
        this.forward = false;
        this.reverse = false;
        this.left = false;
        this.right = false;


        if(carType!="DUMMY" && carType!="AI") {
            this.#addKeyboardControls()
            this.#addTouchControls()
        }
        else if(carType == "DUMMY"){
            this.forward = true;
        }
    }

    #addKeyboardControls() {
        document.addEventListener('keydown', (e)=>{
            const key = e.code;

            switch (key) {
                case 'ArrowUp':
                    this.forward = true;
                    break;
                case 'ArrowDown':
                    this.reverse = true;
                    break;
                case 'ArrowLeft':
                    this.left = true;
                    break;
                case 'ArrowRight':
                    this.right = true;
                    break;
                default:
                    break;
            }
        });
        document.addEventListener('keyup', (e)=>{
            const key = e.code;

            switch (key) {
                case 'ArrowUp':
                    this.forward = false;
                    break;
                case 'ArrowDown':
                    this.reverse = false;
                    break;
                case 'ArrowLeft':
                    this.left = false;
                    break;
                case 'ArrowRight':
                    this.right = false;
                    break;
                default:
                    break;
            }
        });
    }

    #addTouchControls() {
        let touchStartX = 0;
        let touchStartY = 0;
        let isSwiping = false;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            isSwiping = true;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!isSwiping) {
                return;
            };
        
            let touchMoveX = e.changedTouches[0].screenX;
            let touchMoveY = e.changedTouches[0].screenY;
        
            let diffX = touchMoveX - touchStartX;
            let diffY = touchMoveY - touchStartY;
        
            if (Math.abs(diffX) > Math.abs(diffY)) {
                // Horizontal swipe
                if (diffX > 0) {
                    this.right = true;
                } else {
                    this.left = true;
                }
            } else {
                // Vertical swipe
                if (diffY > 0) {
                    this.reverse = true;
                    console.log('rever')
                } else {
                    this.forward = true;
                }
            }
        
            // Optionally update start positions for smooth swipe behavior
            touchStartX = touchMoveX;
            touchStartY = touchMoveY;
        });
        
        document.addEventListener('touchend', () => {
            isSwiping = false;
            console.log('Stop Movement');
            this.forward = false;
                this.reverse = false;
                this.left = false;
                this.right = false;
        });
    }
}