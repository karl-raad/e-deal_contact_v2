//
//  KPIControllerInterfaceController.swift
//  E-DEAL Contact
//
//  Created by mac on 10/12/15.
//
//

import WatchKit
import Foundation
import WatchConnectivity

class KPIController: WKInterfaceController,WCSessionDelegate {
    @IBOutlet var KPITable: WKInterfaceTable!
    @IBOutlet var titleLabel: WKInterfaceLabel!
    @IBOutlet var KPIValueLabel: WKInterfaceLabel!
    var session : WCSession!
    @IBOutlet var arrowImage: WKInterfaceImage!
    @IBOutlet var graphImage: WKInterfaceImage!
    @IBOutlet var descriptionLabel: WKInterfaceLabel!
    var contextArray: NSArray!
    let defaults = NSUserDefaults(suiteName: "group.com.domain.edealContactV2")

    override func awakeWithContext(context: AnyObject?) {
        super.awakeWithContext(context)
        // Configure interface objects here.
        titleLabel.setText(context!["name"] as? String)
        descriptionLabel.setText(context!["desc"] as? String)
        contextArray = context!["values"] as? NSArray
        KPIValueLabel.setText(contextArray![0].valueForKey("value") as? String)
        KPITable.setNumberOfRows(contextArray.count, withRowType: "KPITRC")
        for (var i=0;i<contextArray.count;i++) {
            let row = KPITable.rowControllerAtIndex(i) as! KPITableRowController
            row.dateLabel.setText(contextArray![i].valueForKey("date") as? String)
            row.kpiLabel.setText((contextArray![i].valueForKey("value") as? String))
            if (contextArray[i].valueForKey("color") != nil) {
                switch contextArray[i].valueForKey("color") as! String{
                case "red":
                    row.dateLabel.setTextColor(UIColor.redColor())
                    row.kpiLabel.setTextColor(UIColor.redColor())
                    break
                case "green":
                    row.dateLabel.setTextColor(UIColor.greenColor())
                    row.kpiLabel.setTextColor(UIColor.greenColor())
                    break
                case "yellow":
                    row.dateLabel.setTextColor(UIColor.yellowColor())
                    row.kpiLabel.setTextColor(UIColor.yellowColor())
                    break
                default:
                    row.dateLabel.setTextColor(UIColor.whiteColor())
                    row.kpiLabel.setTextColor(UIColor.whiteColor())
                }
            }
        }
        switch context!["evol"] as? String {
        case "up"?:
            arrowImage.setImage(UIImage(named: "green"))
            KPIValueLabel.setTextColor(UIColor.greenColor())
            break
        case "down"?:
            arrowImage.setImage(UIImage(named: "red"))
            KPIValueLabel.setTextColor(UIColor.redColor())
            break
        case "flat"?:
            arrowImage.setImage(UIImage(named: "yellow"))
            KPIValueLabel.setTextColor(UIColor.yellowColor())
            break
        default: break
        }
        let imageData = NSData(base64EncodedString: context!["graphic"] as! String, options: NSDataBase64DecodingOptions(rawValue: 0))
        let image = UIImage(data: imageData!)
        graphImage.setImage(image)
    }

    override func willActivate() {
        // This method is called when watch view controller is about to be visible to user
        super.willActivate()
        if (WCSession.isSupported()) {
            session = WCSession.defaultSession()
            session.delegate = self;
            session.activateSession()
        }
    }
    
    override func didDeactivate() {
        // This method is called when watch view controller is no longer visible
        super.didDeactivate()
    }
    
    @IBAction func syncAction() {
        if (WCSession.defaultSession().reachable) {
            let message = ["Request" : "Sync"]
            session.sendMessage(message, replyHandler: { (content:[String : AnyObject]) -> Void in
                print("Our counterpart sent something back. Content: \(content)")
                }, errorHandler: {  (error ) -> Void in
                    print("We got an error from our watch device : " + error.domain)
            })
            WKInterfaceController.reloadRootControllersWithNames(["Loading"], contexts:nil)
        }
    }
    
    func session(session: WCSession, didReceiveApplicationContext applicationContext: [String : AnyObject]) {
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
