/**
 * MiniJS Framework - Core Event System
 * Alternative to addEventListener with framework integration
 */

class EventSystem {
    constructor() {
        this.eventHandlers = new Map();
        this.delegatedEvents = new Set();
        this.elementRegistry = new WeakMap();
        this.stateManager = null;
        this.domModule = null;

        this.initializeEventDelegation();
    }

    initializeEventDelegation() {
        const delegatedEventTypes = [
            'click', 'input', 'submit', 'keydown', 'keyup', 'keypress',
            'change', 'focus', 'blur', 'mouseenter', 'mouseleave',
            'mousedown', 'mouseup', 'touchstart', 'touchend'
        ];

        delegatedEventTypes.forEach(eventType => {
            if (!this.delegatedEvents.has(eventType)) {
                document.addEventListener(eventType, this.handleDelegatedEvent.bind(this), true);
                this.delegatedEvents.add(eventType);
            }
        });
    }

    setFrameworkModules({ stateManager, domModule }) {
        this.stateManager = stateManager;
        this.domModule = domModule;
    }

    bind(element, eventConfig) {
        if (!element || !eventConfig) return;

        // Handle virtual elements
        if (element && typeof element === 'object' && element.tag) {
            if (!element._events) element._events = {};
            Object.assign(element._events, eventConfig);
            return;
        }

        const elementId = this.getElementId(element);

        if (!this.eventHandlers.has(elementId)) {
            this.eventHandlers.set(elementId, new Map());
        }

        const elementHandlers = this.eventHandlers.get(elementId);

        Object.entries(eventConfig).forEach(([eventType, handler]) => {
            const normalizedEventType = this.normalizeEventType(eventType);

            if (!elementHandlers.has(normalizedEventType)) {
                elementHandlers.set(normalizedEventType, []);
            }

            const wrappedHandler = this.wrapHandler(handler, element);
            elementHandlers.get(normalizedEventType).push(wrappedHandler);

            this.elementRegistry.set(element, {
                id: elementId,
                events: elementHandlers
            });
        });
    }

    handleDelegatedEvent(event) {
        let target = event.target;

        while (target && target !== document) {
            const elementData = this.elementRegistry.get(target);

            if (elementData && elementData.events.has(event.type)) {
                const handlers = elementData.events.get(event.type);

                handlers.forEach(handler => {
                    try {
                        handler.call(target, event);
                    } catch (error) {
                        console.error('Event handler error:', error);
                    }
                });
            }

            target = target.parentElement;
        }
    }

    

    cleanup(element) {
        this.unbind(element);
    }

    destroy() {
        this.delegatedEvents.forEach(eventType => {
            document.removeEventListener(eventType, this.handleDelegatedEvent.bind(this), true);
        });

        this.eventHandlers.clear();
        this.delegatedEvents.clear();
        this.stateManager = null;
        this.domModule = null;
    }
}

export default EventSystem;