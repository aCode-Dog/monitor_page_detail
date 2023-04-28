/*
 * @Author: yuhao.chen
 * @Date: 2023-03-02 16:31:41
 * @LastEditors: yuhao.chen
 * @LastEditTime: 2023-03-14 14:09:00
 * @FilePath: \react-antd-ts-admin-master\src\pages\infoDetail.tsx
 * @Description:
 */
import { Button, message, Modal, Select, Space, Steps, Table, Tag, theme, Upload } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { UploadOutlined } from '@ant-design/icons'
import React, { useRef, useState } from 'react'
import { UploadFile } from 'antd/lib/upload/interface'
import { formatDate } from '../utils/const'
import originalPositionFor from './sourcemap'
import './index.less'
interface DataType {
	breadcrumb: any
	key: string
	name: string
	age: number
	address: string
	tags: string[]
}
const regText = /(?<=\()(.+?)(?=\))/g
const regMainText = /(?<=(bundle.js:))(.+?)(?=\))/g
const InfoDetail = () => {
	const [fileList, setFileList] = useState<UploadFile[]>([])
	const [tableList, setTableList] = useState()
	const [breadcrumbVisible, setBreadcrumbVisible] = useState<boolean>(false)
	const [stepsList, setStepsList] = useState<any[]>([])
	const [detailOriginCode, setDetailOriginCode] = useState()
	const [detailOriginTitle, setDetailOriginTitle] = useState()
	const sourcemapRef = useRef<UploadFile>()
	const [detailCodeModal, setDetailCodeModal] = useState<boolean>(false)
	const versionRef = useRef<RegExpMatchArray | null>(null)
	const [versionProject, setVersionProject] = useState<RegExpMatchArray | null>(null)
	const [selectValue, setSelectValue] = useState<string>('swhy-test3')
	const options = ['swhy-test3', 'rates-product-test3', 'rates-product-test2']

	const columns: ColumnsType<DataType> = [
		{
			title: '当前用户',
			dataIndex: 'user',
			key: 'type',
			fixed: 'left',
			width: 150,
		},
		{
			title: '类型',
			dataIndex: 'type',
			key: 'type',

			width: 150,
		},
		{
			title: '时间',
			dataIndex: 'time',
			key: 'time',
			width: 200,
			sorter: (a: any, b: any) => {
				return a.time - b.time
			},
			render: (text, record) => {
				return text ? <div key={record.key}>{formatDate(text)}</div> : null
			},
		},
		{
			title: '状态',
			dataIndex: 'status',
			key: 'status',
			width: 200,
			filters: [
				{
					text: 'promise错误',
					value: 'promise错误',
				},
				{
					text: '接口超时',
					value: '接口超时',
				},
				{
					text: 'errorboundary错误',
					value: 'errorboundary错误',
				},
				{
					text: '接口错误',
					value: '接口错误',
				},
				{ text: '图片加载资源异常', value: '图片加载资源异常' },
				{ text: 'js文件加载资源异常', value: 'js文件加载资源异常' },
				{ text: '代码异常', value: '代码异常' },
				{ text: 'websokcet', value: 'websokcet' },
			],
			onFilter: (value: any, record: any) => record.status.indexOf(value) === 0,
		},
		{
			title: '当前页面',
			key: 'page',
			dataIndex: 'page',
			width: 200,
			render: (text, record) => {
				return text ? <div key={record.key}>{text.split('#/')[1]}</div> : null
			},
		},
		{
			title: '错误内容',
			key: 'message',
			dataIndex: 'message',
			width: 300,
		},
		{
			title: '路径',
			key: 'fileName',
			dataIndex: 'fileName',
			width: 200,
		},
		{
			title: '源码还原',
			key: 'line',
			dataIndex: 'line',
			width: 100,
			render: (text, record) => {
				return (record as any).line ? (
					<div key={record.key}>
						{
							<Button type="primary" onClick={e => codeOrgin(record)}>
								代码还原
							</Button>
						}
					</div>
				) : null
			},
		},
		{
			title: '用户行为记录',
			key: 'breadcrumb',
			width: 100,
			dataIndex: 'breadcrumb',
			render: (text, record) => {
				return record.breadcrumb ? (
					<div key={record.key}>
						{
							<Button type="primary" onClick={e => breadcrumbClick(record)}>
								查看用户行为
							</Button>
						}
					</div>
				) : null
			},
		},
	]
	const breadcrumbClick = data => {
		console.log(data.breadcrumb)
		data.breadcrumb.map(item => {
			switch (item.category) {
				case 'Http':
					item.title = 'HTTP'
					item.subTitle = formatDate(item.time)
					item.description = item.url + `——(${item.body ? item.body : ''})`
					item.status = item.step
					break
				case 'Click':
					item.title = item.type
					item.subTitle = formatDate(item.time)
					item.description = item.data

					break
				case 'Route':
					item.title = item.type
					item.subTitle = formatDate(item.time)
					item.description = item.from.split('#')[1] + '——' + item.to.split('#')[1]
					break
				case 'Code_Error':
					item.title = item.type
					item.subTitle = formatDate(item.time)
					item.description = item.message
					item.status = item.step
					break

				default:
					item.title = item.type
					item.subTitle = formatDate(item.time)
					item.description = item.message
					item.status = item.step
					break
			}
		})
		setStepsList(data.breadcrumb)
		setBreadcrumbVisible(true)
	}
	const dealMainData = data => {
		const tableList: any = []
		console.log(data)

		data.map((item, index) => {
			if (item.trim().length !== 0) {
				console.log(item)
				let obj = JSON.parse(item)
				const column = obj.error.stack.match(regMainText)[0].split(':')
				console.log(column)
				obj.key = index
				obj.message = obj.error.message
				obj.line = Number(column[0])
				obj.column = Number(column[1])
				console.log(obj)
				tableList.push(obj)
			}
		})
		console.log(tableList)
		setTableList(tableList)
	}
	const dealFileData = (data, name) => {
		const result = JSON.parse(JSON.stringify(data))
		const objList = result.split('_monitorInfo')

		if (name.includes('main')) {
			return dealMainData(objList)
		}
		const tableList: any = []
		console.log('aaaa')
		objList.map((item, index) => {
			if (item.length > 10) {
				let obj = JSON.parse(item)
				obj.key = item.time + item.type

				if (obj.data) {
					obj = Object.assign(obj, obj.data)
					obj.time = obj.time || obj.startTime
				}

				tableList.push(obj)
			}
		})
		setTableList(tableList)
	}
	const codeOrgin = data => {
		const { line, column } = data
		if (!sourcemapRef.current) return message.error('请上传sourcemap文件')
		originalPositionFor({
			mapFile: { lineno: line, colno: column, mapFiles: sourcemapRef.current },
			callback: (res, title) => {
				setDetailOriginCode(res)
				setDetailOriginTitle(title)
				setDetailCodeModal(true)
			},
		})
	}
	const handleOk = () => {
		setBreadcrumbVisible(false)
	}
	const handleCancel = () => {
		setBreadcrumbVisible(false)
	}
	return (
		<div>
			<div className="wrap-title">监控统计</div>
			{versionProject && <div className="wrap-title-low">当前版本:{versionProject[0]}</div>}
			<Upload
				maxCount={1}
				beforeUpload={file => {
					setFileList([...fileList, file])
					return false
				}}
				onChange={val => {
					const fileObj = val.fileList[0]
					const reader = new FileReader()
					versionRef.current = val.file.name.match(regText)
					setVersionProject(versionRef.current)
					reader.readAsText(fileObj.originFileObj as any)
					reader.onerror = function (event) {
						message.warning('文件读取失败')
						return false
					}
					reader.onload = function (e: any) {
						dealFileData(e.target.result, val.file.name)
					}
				}}
			>
				<Button icon={<UploadOutlined />}>监控日志上传</Button>
			</Upload>
			{/* <Select
				placeholder="请选择下载的源码对应的环境"
				value={selectValue}
				onSelect={val => {
					setSelectValue(val)
				}}
			>
				{options.map(item => {
					return <Select.Option value={item}>{item}</Select.Option>
				})}
			</Select> */}
			<Upload
				maxCount={1}
				beforeUpload={file => {
					return false
				}}
				onDownload={(val: any) => {}}
				onChange={val => {
					if (!versionRef.current) return message.error('请先上传日志')
					const fileObj = val.fileList[0]
					const reader = new FileReader()
					reader.readAsText(fileObj.originFileObj as any)
					reader.onerror = function (event) {
						message.warning('文件读取失败')
						return false
					}
					reader.onload = function (e: any) {
						sourcemapRef.current = e.target.result
					}
				}}
			>
				<Button
					icon={<UploadOutlined />}
					// onClick={() => {
					// 	if (!versionRef.current) return message.error('请先上传日志')
					// 	fetch(
					// 		`${selectValue}.internal.quantinfotech.com/rates/dist-clent/main.${versionRef.current}.js.map`
					// 	)
					// 		.then(res => {
					// 			console.log(res)
					// 		})
					// 		.catch(e => {
					// 			console.log(e)
					// 		})
					// }}
				>
					sourcemap下载
				</Button>
			</Upload>
			<Modal title="用户行为记录" open={breadcrumbVisible} onOk={handleOk} onCancel={handleCancel}>
				<Steps direction="vertical" size="small" items={stepsList} />
			</Modal>
			<Modal
				title={'源码展示 - ' + detailOriginTitle}
				open={detailCodeModal}
				onOk={() => setDetailCodeModal(false)}
				onCancel={() => setDetailCodeModal(false)}
			>
				{(detailOriginCode || []).map((item, index) => {
					return <div className={`${index === 4 ? 'lineHeight' : ''}`}>{item}</div>
				})}
			</Modal>
			<Table columns={columns} dataSource={tableList} rowKey={'monitor'} scroll={{ x: 1300 }} bordered />
		</div>
	)
}
export default InfoDetail
