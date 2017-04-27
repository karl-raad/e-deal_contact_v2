//
//  LoadingController.swift
//  E-DEAL Contact
//
//  Created by mac on 10/29/15.
//
//

import WatchKit
import Foundation
import WatchConnectivity

class LoadingController: WKInterfaceController,WCSessionDelegate {
 
    var session : WCSession!
    let defaults = NSUserDefaults(suiteName: "group.com.domain.edealContactV2")

    override func awakeWithContext(context: AnyObject?) {
        super.awakeWithContext(context)
        // Configure interface objects here.
        if (WCSession.isSupported()) {
            session = WCSession.defaultSession()
            session.delegate = self;
            session.activateSession()
        }
    }

    override func willActivate() {
        // This method is called when watch view controller is about to be visible to user
        super.willActivate()
    }

    override func didDeactivate() {
        // This method is called when watch view controller is no longer visible
        super.didDeactivate()
    }
    
    func session(session: WCSession, didReceiveApplicationContext applicationContext: [String : AnyObject]) {
        print(applicationContext)
        if(applicationContext["error404"] != nil) {
            WKInterfaceController.reloadRootControllersWithNames(["MainInterfaceController"], contexts:["error404"])
        } else if (applicationContext["invalidSession"] != nil) {
            WKInterfaceController.reloadRootControllersWithNames(["MainInterfaceController"], contexts:["sessionInvalid"])
        } else {
            var controllerNames = [String]()
            var controllerContexts = [AnyObject]()
            if applicationContext["interactions"]!.isKindOfClass(NSDictionary) {
                controllerNames.append("Events")
                controllerContexts.append(applicationContext["interactions"]!)
                defaults!.setObject(applicationContext["interactions"] as! NSDictionary, forKey: "glance")
                defaults!.synchronize()
            }
            let kpiContextArray = applicationContext["kpi"]?.valueForKey("KPIJSON")
            do {
                let kpiParsed = try NSJSONSerialization.JSONObjectWithData(kpiContextArray!.dataUsingEncoding(NSUTF8StringEncoding)!, options: NSJSONReadingOptions.AllowFragments)
                if kpiParsed.count > 1 {
                    for (var i=0 ; i<kpiParsed.count ; i++) {
                        controllerNames.append("KPI")
                        controllerContexts.append(kpiParsed[i])
                    }
                }
                for (var i=0;i<controllerNames.count;i++) {
                    print("\(controllerNames[i]) \(controllerContexts[i])")
                }
                WKInterfaceController.reloadRootControllersWithNames(controllerNames, contexts:controllerContexts)
            }catch let error as NSError {
                print("A JSON parsing error occurred for EventsController:\n \(error)")
            }
        }
    }
}
