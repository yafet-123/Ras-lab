import {useEffect,useState} from 'react'
import Link from 'next/link'
import styles from '../../styles/Sidebar.module.css'
import { FaGreaterThan } from 'react-icons/fa';

export default function SideNavbar({mrn}){
    
	return(
		<div className={styles.sidebar}>
            <div className={styles.top}>
                <h3>Laboratory</h3>
            </div>
            <hr className={styles.horizontal}/>
            <div className={styles.center}>
                <ul className={styles.ullist}>
                   	<li className={styles.list}>
                        <Link href={{pathname: `/Lab/AllLabOrderedRequest`, query:{ mrn: mrn }}} >
                            <a style={{ textDecoration: "none" }}>
                                <span className={styles.spanstyle}>Request</span>
                            </a>
                        </Link>
                    </li>

                    <li className={styles.list}>
                        <Link href={{pathname: `/Lab/PendingPayement`, query:{ mrn: mrn }}} >
                            <a style={{ textDecoration: "none" }}>
                                <span className={styles.spanstyle}>Pending Payment</span>
                            </a>
                        </Link>
                    </li>

                    <li className={styles.list}>
                        <Link href={{pathname: `/Lab/PanelsAfterPayment`, query:{ mrn: mrn }}} >
                            <a style={{ textDecoration: "none" }}>
                                <span className={styles.spanstyle}>Pending Process</span>
                            </a>
                        </Link>
                    </li>

                    <li className={styles.list}>
                        <Link href={{pathname: `/Lab/OrderedLabWithResult`, query:{ mrn: mrn }}} >
                            <a style={{ textDecoration: "none" }}>
                                <span className={styles.spanstyle}>Result</span>
                            </a>
                        </Link>
                    </li>

                    

                    
                </ul>
            </div> 
        </div>
	)
}
