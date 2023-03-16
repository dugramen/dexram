import React from "react"

export default function Modal(props: {onHide?, label, children?}) {
    const [shown, setShown] = React.useState(false)
    const modalRef = React.useRef<any>()

    const hide = () => {
        setShown(false)
        props.onHide?.()
    }

    return (
        <div className='FilterPanel'>
            <button onClick={() => setShown(true)}>{props.label}</button>

            <div 
                className={`modal ${shown ? 'shown' : ''}`} 
                onMouseDown={event => modalRef.current && modalRef.current === event.target && hide()}
                ref={modalRef}
            >   
                <div className='modal-content'>
                    {props.children}
                </div>
            </div>
        </div>
    )
}