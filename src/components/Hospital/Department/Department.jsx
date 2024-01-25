/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux'
import { PageSwitch } from '../../../shared/AppEnum'
import { ManageDepartment, CreateOrEditDepartment } from '../../index'

function Department() {
  const pageIndex = useSelector((state) => state.pageSwitch.pageIndex)

  return pageIndex === PageSwitch.ViewPage ? (
    <ManageDepartment />
  ) : (
    <CreateOrEditDepartment />
  )
}

export default Department
