import Header from '../components/Header'
import SideNavbar from '../components/SideNavbar'
import {AiOutlineRight} from 'react-icons/ai'
import Link from 'next/link'
import { useRouter } from "next/router";
import axios from "axios";
import {useEffect,useState } from 'react'
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Cookies from 'universal-cookie';
import {useAuth} from '../context/AuthContext'
import styles from '../../styles/Home.module.css'
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import api from '../components/api.js'

export async function getServerSideProps(context) {
	const {params,req,res,query} = context
	const patient_id_Medical_Record = query.mrn
	const token = req.cookies.token
	if (!token) {
    	return {
      		redirect: {
        		destination: '/login',
        		permanent: false,
      		},
      	}
    }
	const accesstoken = token
	const authaxios = axios.create({
		baseURL : api,
		headers :{
			Authorization : `Bearer ${accesstoken} `
		}
	})
	const data = await authaxios.get(`${api}/laboratory/resultpanel/${patient_id_Medical_Record}`)
	
  	return {
    	props: {
	    	resultpanel:data.data,
	    }, // will be passed to the page component as props
	}
}


export default function PanelsAfterPayment({resultpanel}){
	const ResultpanelRecord = resultpanel['all']
	const ptientMRN = resultpanel['info'].MRN
	const router = useRouter();	
	const IdList = []
	const PanelRecordData=[]
	ResultpanelRecord.map((PanelRecord,index)=>{
		PanelRecord.map((data,index)=>{
			IdList.push(data.InfoId)
			PanelRecordData.push(data);
		})
	})
	const groupBy = keys => array =>
  		array.reduce((objectsByKeyValue, obj) => {
    		const value = keys.map(key => obj[key]).join('-');
    		objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    		return objectsByKeyValue;
  	}, {});
  	const groupById = groupBy(['InfoId']);
  	const PanelRecordDataGroupById = groupById(PanelRecordData)
  	const withOutDuplicateId = [...new Set(IdList)];
	return(
		<div className={styles.home}>
            <SideNavbar mrn={ptientMRN}/>
            <div className={styles.homeContainer}>
				<Header />
				<Container className="px-4" >
					<div className="bg-white border my-3 rounded">
						<Row className="p-3">
							<Col md={4} className="text-center">
								<p>MRN</p>
								<p>{resultpanel['info'].MRN}</p>
							</Col>
							<Col md={4} className="text-center">
								<p>Name</p>
								<p>{resultpanel['info'].Name}</p>
							</Col>
							<Col md={4} className="text-center">
								<p>Age</p>
								<p>{resultpanel['info'].DateOfBirth}</p>
							</Col>
						</Row>

						<Row className="p-3">

							<Col md={4} className="text-center">
								<p>Gender</p>
								<p>{resultpanel['info'].Gender}</p>
							</Col>

							<Col md={4} className="text-center">
								<p>Phone Number</p>
								<p>{resultpanel['info'].PhoneNumber}</p>
							</Col>

							<Col md={4} className="text-center">
								<p>Occupation</p>
								<p>{resultpanel['info'].Occupation}</p>
							</Col>
						</Row>
					</div>
					
					{withOutDuplicateId.map((number,id)=>(
						<div className="bg-white border my-5 rounded">
							<Row className="px-5 py-3">
									<Col md={6} className="">
										<h5>Created By</h5>
										<p>{PanelRecordDataGroupById[number][0].CreatedBy}</p>
									</Col>

									<Col md={6} className="">
										<h5>Created Date</h5>
										<p>{moment(PanelRecordDataGroupById[number][0].Requested_Date).utc().format('YYYY-MM-DD')}</p>
									</Col>
								</Row>
							<Row>
								<Col md={12} className="mt-3 mx-3">
									<h5>Panel</h5>
								</Col>
							</Row>
							<div className="bg-light border m-3 rounded">
						    	{PanelRecordDataGroupById[number].map((data,index)=>(
						    		<Row>
										<Col md={12} className="m-3">
											<p>{data.Panel}</p>
										</Col>
									</Row>
								))}
							</div>

							<div>
		                        <Link href={{pathname: `/Lab/TestsAfterPayment`,query:{ Infoid: number } }} >
		                            <a className="m-3 btn btn-primary">
		                                view
		                            </a>
		                        </Link>
							</div>
						</div>	
					))}		
				</Container>
			</div>
		</div>
	)	
}





