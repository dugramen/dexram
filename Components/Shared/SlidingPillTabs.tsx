import React from "react";

export default function SlidingPillTabs (p: {tabList: any[], setCurrentTab, currentTab, customLabel?}) {
    const tabRef = React.useRef<any>(null)
    const [rect, setRect] = React.useState<any>({width: 0, height: 0, left: 0, top: 0})

    React.useEffect(() => {
        const r = tabRef.current
        // console.log('client tab ' , moveMethodTab)
        setRect(old => ({
                left: r?.offsetLeft ?? old.left,
                right: r?.offsetRight ?? old.right,
                width: r?.offsetWidth ?? old.width,
                height: r?.offsetHeight ?? old.height
            })
        )
    }, [tabRef.current, p.currentTab, p.tabList])

    React.useEffect(() => {
        if (!p.tabList.includes(p.currentTab)) {
            p.setCurrentTab(p.tabList[0])
        }
    }, [p.currentTab, p.tabList])

    return (
        <div className="SlidingPillTabs">
            <div className="bg-pill" style={{
                width: rect.width,
                height: '100%',
                left: rect.left,
                top: rect.top,
                // visibility: p.tabList.includes(p.currentTab) ? 'visible' : 'hidden'
            }}></div>

            {p.tabList.map((tab) => (
                // tabList[tab] && 
                <button 
                    onClick={() => p.setCurrentTab(tab)} 
                    key={tab}
                    className={`tab ${tab === p.currentTab ? 'current' : ''}`}
                    {...(tab === p.currentTab ? {ref: tabRef} : {})}
                >
                    {p.customLabel?.(tab) ?? tab}
                </button>
            ))}
        </div>
    )
}