import { useState } from 'react'
import './FileBrowser.css'

import { TreeView, View } from './components'


function FileBrowser() {

  return (
        <div className="container d-flex flex-row justify-content-between position-absolute">
          <div className="col-4 border border-3 border-primary">
                  <TreeView />
              </div>
              <div className="col-7 border border-3 border-primary">
                  <View />
              </div>
        </div>
  )
}

export default FileBrowser
