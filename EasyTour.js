
let EasyTour = function (selector) {

    //easy tour selector
    this.selector = selector

    //initialize step objects
    this.stepItems = []

    //find and store elements from selector
    //initialize items
    this.selectorElememts = document.querySelectorAll(selector)
    this.selectorElememts.forEach((elem) => {
        let item = {};
        item.elem = elem;
        item.step = parseInt(item.elem.getAttribute("etour-step"))
        item.title = item.elem.getAttribute("etour-title")
        item.desc = item.elem.getAttribute("etour-desc")
        item.click_event_selector = item.elem.getAttribute("etour-click-event-selector")

        this.stepItems.push(item)
    })




    //current step
    this.currentStep = this.findStepItem(1) === undefined ? -1 : 1

    //previous step
    this.previousStep = this.findStepItem(this.currentStep - 1) === undefined ? -1 : this.currentStep - 1

    //next step
    this.nextStep = this.findStepItem(this.currentStep + 1) === undefined ? -1 : this.currentStep + 1


    let boxElem = EasyTour.getBoxElem()

    boxElem.getElementsByClassName('next-btn')[0].addEventListener('click', () => {
        this.nextTourStep()
    })

    boxElem.getElementsByClassName('back-btn')[0].addEventListener('click', () => {
        this.previousTourStep()
    })

    boxElem.getElementsByClassName('end-btn')[0].addEventListener('click', () => {
        this.stopTour()
    })

}


EasyTour.addClass = function (selector, classname) {
    document.querySelectorAll(selector).forEach((item) => {
        item.classList.add(classname)
    })
}

EasyTour.getBoxElem = function () {
    return document.querySelector('.easytour-box-info')
}

EasyTour.getBoxArrowElem = function () {
    return document.querySelector('.easytour > img')
}


EasyTour.addClassToElement = function (element, classname) {
    element.classList.add(classname)
}


EasyTour.removeClass = function (selector, classname) {
    document.querySelectorAll(selector).forEach((item) => {
        item.classList.remove(classname)
    })
}

EasyTour.removeClassToElement = function (element, classname) {
    element.classList.remove(classname)
}

EasyTour.showEasyTour = function (item) {

    //make visible tour box
    EasyTour.addClass('.easytour', 'easytour-visible')

    //add item highlighter
    EasyTour.addClassToElement(item.elem, 'easytour-highlight')


    // - boxArrowElem.getBoundingClientRect().width
    let boxArrowElem = EasyTour.getBoxArrowElem()
    let boxElem = EasyTour.getBoxElem()
    let boxElemLeftStyle = item.elem.getBoundingClientRect().right - boxElem.getBoundingClientRect().width
    boxElemLeftStyle = boxElemLeftStyle < 0 ? boxArrowElem.getBoundingClientRect().width + 10 : boxElemLeftStyle
    let boxElemToptStyle = item.elem.getBoundingClientRect().height + item.elem.getBoundingClientRect().top + 15
    /* console.log('boxElemToptStyle', boxElemToptStyle)
    console.log('itemelem', item.elem.getBoundingClientRect()) */

    if (boxElemToptStyle + boxElem.getBoundingClientRect().height > window.innerHeight) {
        boxElemToptStyle = boxElemToptStyle - boxElem.getBoundingClientRect().height - item.elem.getBoundingClientRect().height - 20
    }


    boxElem.style.left = boxElemLeftStyle + 'px'
    boxElem.style.top = boxElemToptStyle + 'px'


    let boxArrowElemLeftStyle = boxElemLeftStyle - boxArrowElem.getBoundingClientRect().width + 'px'
    let boxArrowElemTopStyle = boxElemToptStyle + 'px'

    boxArrowElem.style.left = boxArrowElemLeftStyle
    boxArrowElem.style.top = boxArrowElemTopStyle


    boxElem.getElementsByClassName('title')[0].innerHTML = item.title
    boxElem.getElementsByClassName('content')[0].innerHTML = item.desc
    boxElem.getElementsByClassName('step-badge')[0].innerHTML = item.step

    boxElem.getElementsByClassName('next-btn')[0].focus()


}


EasyTour.prototype.stepsInit = function () {

    //current step
    this.currentStep = this.findStepItem(1) === undefined ? -1 : 1

    //previous step
    this.previousStep = this.findStepItem(this.currentStep - 1) === undefined ? -1 : this.currentStep - 1

    //next step
    this.nextStep = this.findStepItem(this.currentStep + 1) === undefined ? -1 : this.currentStep + 1
}

EasyTour.inViewport = function (el) {

    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );

}


EasyTour.prototype.startTour = function () {
    if (this.currentStep === -1) {
        this.stepsInit()
    }

    let item = this.findStepItem(this.currentStep);


    //console.log('item.click_event_selector', item.click_event_selector)
    setTimeout(() => {

        if (item.click_event_selector !== null) {
            document.querySelector(item.click_event_selector).click()
        }

        console.log('inview port', EasyTour.inViewport(item.elem))
        if (!EasyTour.inViewport(item.elem)) {
            item.elem.scrollIntoView();
        } else {
            item.elem.scrollIntoView(false);
        }
        EasyTour.showEasyTour(item)

    }, 0);


}

EasyTour.prototype.stopTour = function () {
    //make visible tour box
    EasyTour.removeClass('.easytour', 'easytour-visible')

    //remove each item easytour-highlight
    if (this.currentStep !== -1) {
        console.log(this.currentStep)
        EasyTour.removeClassToElement(this.findStepItem(this.currentStep).elem, 'easytour-highlight')
    }

}



EasyTour.prototype.findStepItem = function (step) {
    return this.stepItems.find((item) => {
        if (item.step == step) {
            return item
        }
    })

}


EasyTour.prototype.nextTourStep = function () {
    this.stopTour();
    this.currentStep = this.findStepItem(this.currentStep + 1) === undefined ? -1 : this.currentStep + 1
    this.previousStep = this.findStepItem(this.currentStep - 1) === undefined ? -1 : this.currentStep - 1
    this.nextStep = this.findStepItem(this.currentStep + 1) === undefined ? -1 : this.currentStep + 1

    if (this.currentStep !== -1) {
        this.startTour();
    }

}

EasyTour.prototype.previousTourStep = function () {
    this.stopTour();
    this.currentStep = this.findStepItem(this.currentStep - 1) === undefined ? -1 : this.currentStep - 1
    this.previousStep = this.findStepItem(this.currentStep - 1) === undefined ? -1 : this.currentStep - 1
    this.nextStep = this.findStepItem(this.currentStep + 1) === undefined ? -1 : this.currentStep + 1

    if (this.currentStep !== -1) {
        this.startTour();
    }
}

EasyTour.addTourBox = function () {
    let template = `<easytour class="easytour">
                                <img src="http://www.stickpng.com/assets/thumbs/580b57fcd9996e24bc43c455.png">
                                <easytour-info-box class="easytour-box-info">
                                    <div class="easytour-box-info-container">
                                        <span class="label label-danger">Step:
                                            <span class="step-badge">5</span>
                                        </span>
                                        <h4 class="title">
                                            <b>Title</b>
                                        </h4>
                                        <p class="content">Interior Designer</p>
                                        <div class="bottom-buttons">

                                            <button type="button" class="btn back-btn">
                                                <span>&lt;&lt;</span>Back</button>
                                            <button type="button" class="btn next-btn">Next
                                                <span>&gt;&gt;</span>
                                            </button>

                                            <button type="button" class="btn end-btn">End Tour</button>
                                        </div>
                                    </div>
                                    </div>
                                </easytour-info-box>
                            </easytour>`

    document.body.innerHTML += template;

}

document.addEventListener('DOMContentLoaded', function () {
    EasyTour.addTourBox()
}, false);

