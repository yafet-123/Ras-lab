import Header from '../components/Header'
import SideNavbar from '../components/SideNavbar'
import {AiOutlineRight} from 'react-icons/ai'
import Link from 'next/link'
import { useRouter } from "next/router";
import axios from "axios";
import {useEffect,useState,useRef } from 'react'
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Cookies from 'universal-cookie';
import {useAuth} from '../context/AuthContext'
import styles from '../../styles/Home.module.css'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import style from '../../styles/SickLeavePrint.module.css'
import {useReactToPrint} from "react-to-print";
import moment from 'moment';
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
	const data = await authaxios.get(`${api}/laboratory/${patient_id_Medical_Record}`)
	
  	return {
    	props: {
	    	LabOrder:data.data,
	    }, // will be passed to the page component as props
	}
}


export default function IndividualPatient({LabOrder}){
	const {currentUser} = useAuth()
	const router = useRouter();
	useEffect(()=>{
        if(!currentUser){
            router.push('/login')
        }
    },[currentUser,router])
	const componentRef = useRef();
	const handlePrint = useReactToPrint({
		content:()=> componentRef.current
	})
	const [PrintData, setPrintData] = useState([])
	const LabOrderRecord = LabOrder['all']
	const OrderData=[]
	const ptientMRN = LabOrder['info'].MRN
	const [RequestId, setRequestId] =  useState([])
	const [RequestName, setRequestName] =  useState([])
	const [Infoid, setInfoid]= useState()
	const cookies = new Cookies();
    const accesstoken = cookies.get('token')
    const authaxios = axios.create({
        baseURL : api,
        headers :{
            Authorization : `Bearer ${accesstoken} `
        }
    })
	const IdList = []
	LabOrderRecord.map((LabOrderRecordOrder,index)=>{
		LabOrderRecordOrder.map((data,index)=>{
			IdList.push(data.InfoId)
			OrderData.push(data);
		})
	})

	const [show, setShow] = useState(false);
  	const handleClose = () => {
  		setShow(false);
  		setRequestId([])
  	}
  	const handleShow = () => setShow(true);
  	const [fullscreen, setFullscreen] = useState(true);

  	const [show1, setShow1] = useState(false);
  	const handleClose1 = () => {
  		setShow1(false);
  	}
  	const handleShow1 = () => setShow1(true);

  	const [show2, setShow2] = useState(false);
  	const handleClose2 = () => {
  		setShow2(false);
  		setRequestName([])
  		setPrintData([])
  	}
  	const handleShow2 = () => setShow2(true);

	const withOutDuplicateId = [...new Set(IdList)];
	const groupBy = keys => array =>
  		array.reduce((objectsByKeyValue, obj) => {
    		const value = keys.map(key => obj[key]).join('-');
    		objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    		return objectsByKeyValue;
  	}, {});
  	const groupById = groupBy(['InfoId']);
  	const [Dates,setDates] = useState("")
  	const [createdBy,setCreatedBy] = useState("")
  	
  	const LabOrderGroupById = groupById(OrderData)
  	const AddToTheRequestId = (number)=>{
  		setRequestName([])
  		setInfoid(number)
  		LabOrderGroupById[number].map((data,index)=>{
  			setRequestName(RequestName=>[...RequestName, { id: data.id , Panel: data.Panel }]);
  		})
  	}
  	console.log(PrintData)
  	const SubmitUpdate = async(e)=>{
        e.preventDefault()
        console.log(RequestId)
        await authaxios.patch(`${api}/laboratory/`,{
        	InfoId:Infoid,
            RequestId:RequestId,
        }).then(function (response) {
            router.reload()
        }).catch(function (error) {
            console.log(error);
        });
  	}
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
								<p>{LabOrder['info'].MRN}</p>
							</Col>
							<Col md={4} className="text-center">
								<p>Name</p>
								<p>{LabOrder['info'].Name}</p>
							</Col>
							<Col md={4} className="text-center">
								<p>Age</p>
								<p>{LabOrder['info'].DateOfBirth}</p>
							</Col>
						</Row>

						<Row className="p-3">

							<Col md={4} className="text-center">
								<p>Gender</p>
								<p>{LabOrder['info'].Gender}</p>
							</Col>

							<Col md={4} className="text-center">
								<p>Phone Number</p>
								<p>{LabOrder['info'].PhoneNumber}</p>
							</Col>

							<Col md={4} className="text-center">
								<p>Occupation</p>
								<p>{LabOrder['info'].Occupation}</p>
							</Col>
						</Row>
					</div>
					<div>
						{withOutDuplicateId.map((number,id)=>(
							<div className="bg-white border my-5 rounded">
								<Row className="px-5 py-3">
									<Col md={6} className="">
										<h5>Created By</h5>
										<p>{LabOrderGroupById[number][0].CreatedBy}</p>
									</Col>

									<Col md={6} className="">
										<h5>Created Date</h5>
										<p>{moment(LabOrderGroupById[number][0].Requested_Date).utc().format('YYYY-MM-DD')}</p>
									</Col>
								</Row>
								<Row className="py-2 px-3">
									<Col md={12} className="d-flex justify-content-between px-5">
										<h5>Panel</h5>
									</Col>
								</Row>
								<div className="bg-light border m-3 rounded">
							    	{LabOrderGroupById[number].map((data,index)=>(
										<Row className="p-3">
											<Col md={12} className="d-flex justify-content-between px-5">
												<p>{data.Panel}</p>
											</Col>
										</Row>
									))}
								</div>

								<div>
									<Button className="m-3"
										variant="primary" 
										onClick={(index)=>{
							        		handleShow()
							        		AddToTheRequestId(number)	
							        	}}
							        >
							        	Transfer To Payment
	     						 	</Button>

		                                <Button className="m-3"
											variant="primary" 
											onClick={(index)=>{
								        		handleShow2()
								        		AddToTheRequestId(number)
								        		
								        		setDates(LabOrderGroupById[number][0].Requested_Date)
								        		setCreatedBy(LabOrderGroupById[number][0].CreatedBy)
								        	}}
								        >
						        			Unavaluble
     						 			</Button>

								</div>
							</div>	
						))}

						<Modal size="lg" show={show1} onHide={handleClose1} dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title">
							<Modal.Header closeButton>
								<Modal.Title>Modal title</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<div className={style.Print} ref={componentRef}>
			        				<Container>
							            <h4 className="d-flex justify-content-center">
					            			Ras Hospital Management System
					          			</h4>

					          			<h5 className="d-flex justify-content-center">
					          				Lab Request
					          			</h5>

					          			<div className="d-flex justify-content-between">
						          				<div className="d-flex flex-column">
											      	<h6>Address</h6>
											      	<p>
											      		Addis Ababa, Ethiopia
											      	</p>
											    </div>
											    <div className="d-flex flex-column">
											        <h6>Phone</h6>
											        <p>
											          	+251-911-123-456
											        </p>
											    </div>

											    <div className="d-flex flex-column">
											        <h6>Email</h6>
											        <p>
														someone@gmail.com
											        </p>
											    </div>
											    <div className="d-flex flex-column">
											        <h6>Postal</h6>
											        <p>
											          	01234
											        </p>
											    </div>
					      				</div>

						      			<div className="d-flex justify-content-between">
						          				<div md={3} className="d-flex flex-column">
											      	<h6>MRN</h6>
											      	<p>
											      		{LabOrder['info'].MRN}
											      	</p>
											    </div>
											    <div md={3} className="d-flex flex-column">
											        <h6>Full Name</h6>
											        <p>
											          	{LabOrder['info'].Name}
											        </p>
											    </div>
											    <div md={3} className="d-flex flex-column">
											        <h6>Age</h6>
											        <p>
														{LabOrder['info'].DateOfBirth}
											        </p>
											    </div>
											    <div md={3} className="d-flex flex-column">
											        <h6>Gender</h6>
											        <p>
											          	{LabOrder['info'].Gender}
											        </p>
											    </div>
						      			</div>

					      				<div className="d-flex justify-content-between">
										    <div className="d-flex flex-column">
										        <h6>Date of Examination</h6>
										        <ol>
										          	{ PrintData.map((data,index)=>(
														<li>
														    {data.Panel}
														</li>
													))}
										        </ol>
										    </div>
					      				</div>

					      				<div className="d-flex justify-content-between">
					      					<div className="d-flex flex-column">
										        <h6>Date of Examination</h6>
										        <p>
													{moment(Dates).utc().format('YYYY-MM-DD')}
										        </p>
										    </div>

					      					<div className="d-flex flex-column">
										        <h6>Doctor's Name</h6>
										        <p>
													{createdBy}
										        </p>
										    </div>
										</div>
	      							</Container>
	        					</div>	
							</Modal.Body>
							<Modal.Footer>
								<Button variant="primary" onClick={handlePrint}>
									Print
								</Button>
								<Button variant="secondary" onClick={handleClose1}>
									Close
								</Button>
							</Modal.Footer>
						</Modal>

						<Modal size="lg" show={show} onHide={handleClose} dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title">
							<Modal.Header closeButton>
								<Modal.Title>Modal title</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								{ RequestName.map((data,index)=>(
									<div className="form-check">
									  	<input 
									  		className="form-check-input" 
									  		type="checkbox" 
									  		value={data.id} 
									  		id={data.Panel} 
									  		onChange={(e)=> setRequestId([...RequestId, parseInt(e.target.value)])}
									  	/>
									  	<label className="form-check-label" htmlFor={data.Panel}>
									    	{data.Panel}
									  	</label>
									</div>
								))}
							</Modal.Body>
							<Modal.Footer>
								<Button onClick={SubmitUpdate}>
									submit
								</Button>
								<Button variant="secondary" onClick={handleClose}>
									Close
								</Button>
							</Modal.Footer>
						</Modal>

						<Modal size="lg" show={show2} onHide={handleClose2} dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title">
								<Modal.Header closeButton>
									<Modal.Title>Modal title</Modal.Title>
								</Modal.Header>
								<Modal.Body>
									{ RequestName.map((data,index)=>(
										<div className="form-check">
										  	<input 
										  		className="form-check-input" 
										  		type="checkbox" 
										  		value={data.id} 
										  		id={data.Panel} 
										  		onChange={(e)=> setPrintData([...PrintData, {Panel:data.Panel}])}
										  	/>
										  	<label className="form-check-label" for={data.Panel}>
										    	{data.Panel}
										  	</label>
										</div>
									))}
								</Modal.Body>
								<Modal.Footer>
									<Button onClick={handleShow1}>
										Print
									</Button>
									<Button variant="secondary" onClick={handleClose2}>
										Close
									</Button>
								</Modal.Footer>
							</Modal>
					</div>		
				</Container>
			</div>
		</div>
	)	
}





