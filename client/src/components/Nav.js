import React from "react";

const Nav = ({ toggleFiltersMenu }) => {
    // Define styles as JavaScript objects
    const styles = {
        navbar: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#2c3e50', // Darker background for a sleek look
            padding: '15px 30px', // Increased padding for a spacious layout
            color: 'white',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            fontFamily: 'Arial, sans-serif', // Consistent font family
        },
        brand: {
            fontSize: '1.8rem', // Larger brand font size
            fontWeight: 'bold', // Bold text for the brand
        },
        brandLink: {
            color: '#ecf0f1', // Soft link color for the brand
            textDecoration: 'none',
            transition: 'color 0.3s ease',
        },
        navList: {
            listStyle: 'none',
            display: 'flex',
            gap: '30px', // Increased spacing for a more spacious look
            margin: 0,
            padding: 0,
        },
        navItem: {
            position: 'relative',
        },
        navLink: {
            color: '#ecf0f1', // Link color
            textDecoration: 'none',
            transition: 'color 0.3s ease',
        },
        navLinkHover: {
            color: '#3498db', // Link color on hover
        },
        filterItem: {
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: '#ecf0f1',
        },
        filterIcon: {
            marginLeft: '5px',
            color: 'yellow', // Icon color
        },
    };

    return (
        <header style={styles.navbar}>
            <div style={styles.brand}>
                <a href="/" style={styles.brandLink}>User Dashboard<br /></a>
            </div>
            <nav>
                <ul style={styles.navList}>
                    <li style={styles.navItem}>
                    </li>
                    <li style={styles.filterItem} onClick={toggleFiltersMenu}>
                        Filters <i className="fas fa-filter" style={styles.filterIcon} />
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Nav;
