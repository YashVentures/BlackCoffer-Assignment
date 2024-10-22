import { useState, useRef, useEffect } from "react";
import * as d3 from 'd3';
import { useD3 } from '../utils/customHooks';

function FiltersMenu({ data, showOrHide, addFilters, hideFiltersMenu }) {
    const sideNav = useRef();
    
    useEffect(() => {
        if (showOrHide) {
            sideNav.current.classList.add('open');
            sideNav.current.style.width = '50%'; // Width set to half the screen
        } else {
            sideNav.current.classList.remove('open');
            sideNav.current.style.width = '0'; // Width when closed
        }
    }, [showOrHide]);

    const [values, setValues] = useState({
        start_year: '',
        end_year: '',
        topic: [],
        sector: [],
        region: [],
        country: [],
        source: []
    });

    const handleInputChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
    };

    const handleFilterForm = (e) => {
        e.preventDefault();
        addFilters(values);
        setValues({
            start_year: '',
            end_year: '',
            topic: [],
            sector: [],
            region: [],
            country: [],
            source: []
        });
    };

    const handleCheckBoxInput = (d) => {
        let arr = values[d.target.name] || [];
        if (d.target.checked) {
            arr.push(d.target.value);
        } else {
            arr.splice(arr.findIndex(a => a === d.target.value), 1);
        }
        setValues({
            ...values,
            [d.target.name]: arr
        });
    };

    const ref = useD3((div) => {
        let keys = ['topic', 'sector', 'region', 'source', 'country'];
        keys.forEach(key => {
            let options = [...new Set(data.map(d => d[key]))].filter(a => a !== '');
            let checkBox = div.select(`.${key}-filter`)
                .select('.scrollable')
                .selectAll('label')
                .data(options)
                .enter()
                .append('div');
            
            checkBox
                .insert('input')
                .attr('value', d => d)
                .attr('type', 'checkbox')
                .attr('name', key)
                .on('click', handleCheckBoxInput);
            checkBox
                .append('span')
                .text(d => d);
        });

        d3.select('span#reset')
            .on('click', function () {
                d3.selectAll('input[type=\'checkbox\']')
                    .property('checked', false);
                addFilters({ reset: true });
            });
    }, [data.length]);

    return (
        <div ref={sideNav} className="sidenav" style={styles.sidenav}>
            <button className="hide" onClick={hideFiltersMenu} style={styles.closeButton}>
                &times;
            </button>
            <form className="filters-list" onSubmit={handleFilterForm} ref={ref} style={styles.form}>
                <h2 style={styles.title}>Filter Options</h2>
                <div style={styles.formSection}>
                    <label htmlFor="start_year" style={styles.label}>YEAR RANGE</label>
                    <div className="years-filter" style={styles.yearRange}>
                        <input name="start_year" type="text" value={values.start_year} onChange={handleInputChange} style={styles.input} placeholder="Start Year"/> -
                        <input name="end_year" type="text" value={values.end_year} onChange={handleInputChange} style={styles.input} placeholder="End Year"/>
                    </div>
                </div>
                <div className="filters-list-grid" style={styles.grid}>
                    {['topic', 'sector', 'region', 'country', 'source'].map((filter, index) => (
                        <div className={`${filter}-filter`} key={index} style={styles.filterSection}>
                            <label style={styles.filterLabel}>{filter.toUpperCase()} FILTER</label>
                            <div className="scrollable" style={styles.scrollable}></div>
                        </div>
                    ))}
                </div>
                <div style={styles.buttonContainer}>
                    <input type="submit" value="Apply" style={styles.applyButton} />
                    <span id="reset" style={styles.resetButton}>Reset</span>
                </div>
            </form>
        </div>
    );
}

// Inline styles for the FiltersMenu component
const styles = {
    sidenav: {
        height: '100%', // Full height
        width: '0', // Initial width
        position: 'fixed', // Fixed position
        zIndex: '1000', // On top
        left: '0',
        top: '0',
        backgroundColor: '#282c34', // Dark background
        overflowX: 'hidden', // Hide horizontal scroll
        transition: 'width 0.5s', // Transition effect
        paddingTop: '20px', // Space for button
        color: 'white', // Text color
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.3)', // Shadow
    },
    closeButton: {
        position: 'absolute',
        top: '20px',
        right: '25px',
        fontSize: '30px',
        background: 'none',
        border: 'none',
        color: '#61dafb', // Color of close button
        cursor: 'pointer',
    },
    form: {
        padding: '20px',
        height: '100%', // Fill full height
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto', // Enable vertical scroll if needed
    },
    title: {
        fontSize: '24px',
        marginBottom: '20px',
        textAlign: 'center',
        color: '#61dafb', // Title color
    },
    formSection: {
        marginBottom: '20px',
    },
    label: {
        fontWeight: 'bold',
        marginBottom: '10px',
        display: 'block',
    },
    yearRange: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
    },
    input: {
        width: '80px',
        padding: '10px',
        marginRight: '10px',
        borderRadius: '4px',
        border: '1px solid #61dafb', // Light border
        backgroundColor: '#fff',
        color: '#000',
        outline: 'none', // Remove outline on focus
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr', // Two columns for filters
        gap: '20px',
        flex: '1', // Make it flexible to take available space
    },
    filterSection: {
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: '#444', // Filter section background
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Subtle shadow
    },
    filterLabel: {
        fontWeight: 'bold',
        marginBottom: '10px',
        display: 'block',
        color: '#61dafb', // Color of filter label
    },
    scrollable: {
        maxHeight: '150px',
        overflowY: 'auto', // Vertical scroll
        backgroundColor: '#555', // Scrollable area background
        borderRadius: '4px',
        padding: '10px',
        marginBottom: '10px', // Space below scrollable area
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px', // Space above buttons
    },
    applyButton: {
        backgroundColor: '#61dafb',
        color: 'white',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        flexGrow: 1, // Grow to take available space
        marginRight: '10px', // Space between buttons
    },
    resetButton: {
        background: '#fd8f23',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        flexGrow: 1, // Grow to take available space
        marginLeft: '10px', // Space between buttons
    },
};

export default FiltersMenu;
