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
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import api from '../components/api.js'

export async function getServerSideProps(context) {
	const {params,req,res,query} = context
	const patient_id_Medical_Record = query.Infoid
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
	const data = await authaxios.get(`${api}/laboratory/resulttest/${patient_id_Medical_Record}`)
	
  	return {
    	props: {
	    	resulttest:data.data,
	    }, // will be passed to the page component as props
	}
}


export default function PanelsAfterPayment({resulttest}){
	const ResultTestRecord = resulttest['all']
	const ptientMRN = resulttest['info'].MRN
	const router = useRouter();
	const IdList = []
	const pass = []
	const cookies = new Cookies();
    const accesstoken = cookies.get('token')
	ResultTestRecord.map((data)=>(
		IdList.push(data.PanelId)
	))
	const withOutDuplicateId = [...new Set(IdList)];

	const authaxios = axios.create({
		baseURL : api,
		headers :{
			Authorization : `Bearer ${accesstoken} `
		}
	})
	const groupBy = keys => array =>
  		array.reduce((objectsByKeyValue, obj) => {
    		const value = keys.map(key => obj[key]).join('-');
    		objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    		return objectsByKeyValue;
  	}, {});

  	const groupById = groupBy(['PanelId']);
  	const patientLabGroupById = groupById(ResultTestRecord)
	const [id, setid] = useState([])
    const [result, setresult] = useState([])
    const [Result,setResult] = useState([])
    console.log(pass)

	const [Data,setData] = useState([])
	const [addindividualData, setaddindividualData] = useState("")
	const [TestValue,setTestValue] = useState("")
	const [show, setShow] = useState(false);
  	const handleClose = () => {setShow(false);}
  	const handleShow = () => setShow(true);
  	console.log(addindividualData)

  	const [show1, setShow1] = useState(false);
  	const handleClose1 = () => {setShow1(false);}
  	const handleShow1= () => setShow1(true);

  	const [show2, setShow2] = useState(false);
  	const handleClose2 = () => {setShow2(false);}
  	const handleShow2= () => setShow2(true);

  	const SubmitUpdate = async(e)=>{
        console.log(pass)
  	}

  	const addIntoCompleteaggretValue = ()=>{
  		setResult(Result=>[...Result , {id:addindividualData.id,result:TestValue}])
  		setTestValue("")
  		handleClose()
  	}
  	console.log(Data)
  	const sendTheaggreagateValueToTheServer = async(e)=>{
  		e.preventDefault()
        await authaxios.patch(`${api}/laboratory/resultpanel/`,{
        	Result:Result
        }).then(function (response) {
            router.reload()
        }).catch(function (error) {
            console.log(error);
        });
  	}
  	const [InfoId,setInfoId] = useState("")
  	const [PanelId,setPanelId] = useState("")
  	console.log(InfoId)
  	console.log(PanelId)
  	const ResultRelease = async(e)=>{
  		e.preventDefault()
        await authaxios.patch(`${api}/laboratory/resultrelease/`,{
        	InfoId:parseInt(InfoId),
        	PanelId:parseInt(PanelId)
        }).then(function (response) {
            router.push({
                pathname: `/Lab/OrderedLabWithResult`,
                query: { mrn: ptientMRN },
            })
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
								<p>{resulttest['info'].MRN}</p>
							</Col>
							<Col md={4} className="text-center">
								<p>Name</p>
								<p>{resulttest['info'].Name}</p>
							</Col>
							<Col md={4} className="text-center">
								<p>Age</p>
								<p>{resulttest['info'].DateOfBirth}</p>
							</Col>
						</Row>

						<Row className="p-3">

							<Col md={4} className="text-center">
								<p>Gender</p>
								<p>{resulttest['info'].Gender}</p>
							</Col>

							<Col md={4} className="text-center">
								<p>Phone Number</p>
								<p>{resulttest['info'].PhoneNumber}</p>
							</Col>

							<Col md={4} className="text-center">
								<p>Occupation</p>
								<p>{resulttest['info'].Occupation}</p>
							</Col>
						</Row>
					</div>
					
					{withOutDuplicateId.map((number,id)=>(
						<div className="bg-white border my-5 rounded">
							<Row className="px-5 py-2">
									<Col md={4} className="">
										<h5>Created By</h5>
										<p>{patientLabGroupById[number][0].CreatedBy}</p>
									</Col>

									<Col md={4} className="">
										<h5>Created Date</h5>
										<p>{moment(patientLabGroupById[number][0].Requested_Date).utc().format('YYYY-MM-DD')}</p>
									</Col>

									<Col md={4} className="">
										<h5>Panel</h5>
										<p>{patientLabGroupById[number][0].Panel}</p>
									</Col>
								</Row>
							<Row className="py-1 px-4">
								<Col md={12}>
									<h5>Test</h5>
								</Col>
							</Row>
							<div className="bg-light border m-3 rounded">
						    	{patientLabGroupById[number].map((data,index)=>(

									<Row className="p-3">
										<Col md={6}>
											<p>{data.Test}</p>
										</Col>
										<Col md={6}>
											<Button className="m-3"
												variant="primary" 
												onClick={(index)=>{
								        			handleShow()
								        			setaddindividualData(data)	
								        		}}
						        			>
						        				Individual Test Result
     						 				</Button>
										</Col>
									</Row>
								))}
							</div>

							<div>
								<Button className="m-3"
									variant="primary" 
									onClick={
								       	sendTheaggreagateValueToTheServer
								    }
						        >
						        	All Result Submit
     						 	</Button>

								<Button className="m-3"
									variant="primary" 
									onClick={()=>{
						        		
						        		setInfoId(patientLabGroupById[number][0].InfoId)
  										setPanelId(patientLabGroupById[number][0].PanelId)
  										ResultRelease()
						        	}}
						        >
						        	Result Release
     						 	</Button>
							</div>
						</div>	
					))}	

					<Modal size="lg" show={show} onHide={handleClose} dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title">
						<Modal.Header closeButton>
							<Modal.Title>Modal title</Modal.Title>
						</Modal.Header>
							<Modal.Body>
									<Row className="my-3">

				                        <Col md={2}>
				                        	<h5>Test</h5>
				                        	<p>{addindividualData.Test}</p>

				                        </Col>

				                        <Col md={10}>
				                           	<FloatingLabel controlId="floatingTextarea2" label="Result">
				                              	<Form.Control
				                                 	as="textarea"
				                                 	placeholder="Result"
				                                 	style={{ height: '200px' }}
				                                 	value={TestValue}
				                                 	onChange={(e) => setTestValue(e.target.value)}
				                              	/>
				                           	</FloatingLabel>
				                        </Col>
                     				</Row>
							</Modal.Body>
							<Modal.Footer>
							<Button onClick={addIntoCompleteaggretValue}>
								submit
							</Button>
							<Button variant="secondary" onClick={handleClose}>
								Close
							</Button>
						</Modal.Footer>
					</Modal>

					<Modal size="lg" show={show1} onHide={handleClose1} dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title">
						<Modal.Header closeButton>
							<Modal.Title>Modal title</Modal.Title>
						</Modal.Header>
							<Modal.Body>
								<p>Do you want to release panel<span className="fs-5 px-1 text-primary">{Data[0].Panel}</span></p>
							</Modal.Body>
							<Modal.Footer>
							<Button variant="primary" onClick={()=>{
								

							}}>
								Release
							</Button>
							<Button variant="secondary" onClick={handleClose1}>
								Close
							</Button>
						</Modal.Footer>
					</Modal>
				</Container>
			</div>
		</div>
	)	
}





