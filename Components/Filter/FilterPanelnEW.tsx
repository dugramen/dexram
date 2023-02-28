import React from 'react';
import { filterData, updateFilterData, FilterData, setStateUpdater, TriMark } from './FilterClasses';
import { CollageGrid, Modal } from '../Utils';
import { WindowWidth } from '../../pages/_app';


export default function FilterPanelNew(props) {
    const [manualUpdate, setManualUpdate] = React.useState(0)
    const isMobile = React.useContext(WindowWidth) < 1000

    const update = () => setManualUpdate(old => old + 1)
    React.useEffect(() => {
        setStateUpdater(update)
    }, [])
    
    return (
        <Modal label='Filters' onHide={() => props.update?.()}>
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
    const filteredEntries = Object.entries(filterData).filter(prefix ? entry => entry[0].startsWith(prefix) : customFilter ?? false)
    const tagClick = () => { if (type === 'tag') { 
        const val = {0: 1, 1: -1, '-1': 0}[`${checked}`]
        filteredEntries.forEach(entry => entry[1].value = val)
        setChecked(val)
    }}
    return <div className=''>
        <h2 className='section-header' onClick={tagClick}>{type === 'tag' ? 
            <> {header} <TriMark value={checked}/> </>
        : header}</h2>
        <div className={`${type}-container`}>
            { filteredEntries.map(entry => <React.Fragment key={entry[0]}>{entry[1]?.component()}</React.Fragment>) }
        </div>
    </div>
}