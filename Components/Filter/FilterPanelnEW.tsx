import React from 'react';
import { filterData, updateFilterData, FilterData, filterChanged, filterChangeConfirmed, TriMark } from './FilterClasses';
import { CollageGrid, Modal } from '../Utils';
import { WindowWidth } from '../../pages/_app';


export default function FilterPanelNew(props) {
    const windowWidth = React.useContext(WindowWidth)
    const isMobile = windowWidth < 1000
    const [manualUpdate, setManualUpdate] = React.useState(0)

    const update = () => setManualUpdate(old => old + 1)
    React.useEffect(() => {
        filterChanged.connect(update)
        return () => {
            filterChanged.disconnect(update)
        }
    }, [])
    
    return (
        <Modal label='Filters' onHide={() => {props.update?.(); filterChangeConfirmed.emit()}}>
            <CollageGrid columns={isMobile ? 1 : 2}>
                <Section header='Tags' type='tag' prefix='Tags'/>
                <Section header='Types' type='tag' prefix='Types'/>
                <Section header='Stats' prefix='Stats'/>
                <Section header='Evolution' prefix='Evolution'/>
                <Section header='Properties' prefix='Ranges'/>
                <Section header='Moves' prefix='Moves'/>
            </CollageGrid>
        </Modal>
    )
}

function Section({header, prefix, customFilter, type}: {header: string, prefix?: string, customFilter?: any, type?: 'tag' | 'range'}) {
    const [checked, setChecked] = React.useState(0)
    const windowWidth = React.useContext(WindowWidth)

    const filteredEntries = Object.entries(filterData).filter(prefix ? entry => entry[0].startsWith(prefix) : customFilter ?? false)
    const tagClick = () => { if (type === 'tag') { 
        const val = {0: 1, 1: -1, '-1': 0}[`${checked}`]
        filteredEntries.forEach(entry => entry[1].value = val)
        setChecked(val)
    }}

    return <div>
        <h2 className='section-header' onClick={tagClick}>{type === 'tag' ? 
            <> 
                {header} 
                <TriMark value={checked}/> 
            </>
        : header}</h2>
        <div className={`${type}-container`}>
            { 
                filteredEntries
                .map(entry => {
                    const Comp = entry[1].component
                    return <React.Fragment key={entry[0]}>
                        <Comp windowWidth={windowWidth}/>
                        {/* { entry[1]?.component() } */}
                    </React.Fragment>
                }
                ) 
            }
        </div>
    </div>
}