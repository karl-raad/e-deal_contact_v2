//
//  InterfaceController.swift
//  E-DEAL WATCH Extension
//
//  Created by mac on 10/9/15.
//
//

import WatchKit
import WatchConnectivity

class EventsController: WKInterfaceController,WCSessionDelegate {
    @IBOutlet var eventsTable: WKInterfaceTable!
    @IBOutlet var noEventsLabel: WKInterfaceLabel!
    var session : WCSession!
    var data : NSArray!
    var labels : NSDictionary!
    let defaults = NSUserDefaults(suiteName: "group.com.domain.edealContactV2")
    override func awakeWithContext(context: AnyObject?) {
        super.awakeWithContext(context)
        // Configure interface objects here.
        if (WCSession.isSupported()) {
            session = WCSession.defaultSession()
            session.delegate = self;
            session.activateSession()
        }
        data = context!["result"] as! NSArray
        let dateFormatterOld = NSDateFormatter()
        let dateFormatterNew = NSDateFormatter()
        let dateFormatterYear = NSDateFormatter()
        let dateFormatterMonth = NSDateFormatter()
        let dateFormatterDay = NSDateFormatter()
        let timeFormatterOld = NSDateFormatter()
        let timeFormatterNew = NSDateFormatter()
        let calendar = NSCalendar.autoupdatingCurrentCalendar()
        let components = NSDateComponents()
        dateFormatterOld.dateFormat = "dd/MM/yyyy"
        timeFormatterOld.dateFormat = "HH:mm"
        dateFormatterYear.dateFormat = "yyyy"
        dateFormatterMonth.dateFormat = "M"
        dateFormatterDay.dateFormat = "d"
        let parsedLocale = NSLocale.init(localeIdentifier: context!["locale"] as! String)
        dateFormatterNew.locale = parsedLocale
        timeFormatterNew.locale = parsedLocale
        dateFormatterNew.setLocalizedDateFormatFromTemplate("EdMMM")
        timeFormatterNew.timeStyle = NSDateFormatterStyle.ShortStyle
        eventsTable.setNumberOfRows(data.count, withRowType: "EventsTRC")
        for (var i=0;i<data.count;i++) {
            let dateFromString = dateFormatterOld.dateFromString(data[i][0].valueForKey("content") as! String)
            let startTimeFromString = timeFormatterOld.dateFromString(data[i][2].valueForKey("content") as! String)
            let endTimeFromString = timeFormatterOld.dateFromString(data[i][3].valueForKey("content") as! String)
            let stringDateYear = dateFormatterYear.stringFromDate(dateFromString!)
            let stringDateMonth = dateFormatterMonth.stringFromDate(dateFromString!)
            let stringDateDay = dateFormatterDay.stringFromDate(dateFromString!)
            components.year = Int(stringDateYear)!
            components.month = Int(stringDateMonth)!
            components.day = Int(stringDateDay)!
            let newDate = calendar.dateFromComponents(components)
            let prettyDate = dateFormatterNew.stringFromDate(newDate!)
            let row = eventsTable.rowControllerAtIndex(i) as! EventsTableRowController
            if data[i][2].valueForKey("content") as! String == "" || data[i][3].valueForKey("content") as! String == "" {
                row.timeLabel.setHidden(true)
            }
            if (startTimeFromString != nil) && (endTimeFromString != nil) {
                timeFormatterNew.stringFromDate(startTimeFromString!)
                row.timeLabel.setText("\(timeFormatterNew.stringFromDate(startTimeFromString!)) - \(timeFormatterNew.stringFromDate(endTimeFromString!))")
            }
            row.subjectLabel.setText(data[i][1].valueForKey("content") as? String)
            if i>0 {
                if data[i][0].valueForKey("content") as! String == data[i-1][0].valueForKey("content")as! String {
                    row.dateLabel.setHidden(true)
                    let previousRow = eventsTable.rowControllerAtIndex(i-1) as! EventsTableRowController
                    previousRow.spacingGroup.setHidden(true)
                }
            }
            row.dateLabel.setText(prettyDate)
            if data[i][4].valueForKey("content") as! String == "" {
                row.placeLabel.setHidden(true)
            }
            row.placeLabel.setText(data[i][4].valueForKey("content") as? String)
            let colorString = data[i][9].valueForKey("content") as? String
            let colorArray = (colorString?.componentsSeparatedByString("|"))! as [String]
            if colorArray.count >= 3 {
                if colorArray[2].substringToIndex(colorArray[2].startIndex.advancedBy(1)) == "#" {
                    let colorHexArray = colorArray[2].componentsSeparatedByString("#")
                    let trimmedString = colorHexArray[1]
                    if trimmedString.characters.count == 6 {
                        let regex = try! NSRegularExpression(pattern: "^[0-9a-f]*$", options: .CaseInsensitive)
                        let found = regex.firstMatchInString(trimmedString, options: [], range: NSMakeRange(0, trimmedString.characters.count))
                        if (found != nil) && (found?.range.location != NSNotFound) {
                                row.typeSeparator.setHidden(false)
                                row.typeSeparator.setColor(UIColorFromRGB(colorHexArray[1]))
                        }
                    }
                }
            }
            labels = context!["labels"] as! NSDictionary
            setTitle(labels.valueForKey("EVENTS") as? String)
        }
        if (data != nil) {
            noEventsLabel.setHidden(true)
            eventsTable.setHidden(false)
        }
        if (data.isEqualToArray([])) {
            noEventsLabel.setHidden(false)
            eventsTable.setHidden(true)
            switch NSLocale.preferredLanguages()[0] {
            case "en":
                noEventsLabel.setText("No events")
            case "fr":
                noEventsLabel.setText("Auncun événement")
            case "de":
                noEventsLabel.setText("keine Termine")
            case "it":
                noEventsLabel.setText("Non ci sono eventi")
            case "es":
                noEventsLabel.setText("No hay eventos")
            case "nl":
                noEventsLabel.setText("geen activiteiten")
            default:
                noEventsLabel.setText("No events")
            }
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
    
    override func contextForSegueWithIdentifier(segueIdentifier: String, inTable table: WKInterfaceTable, rowIndex: Int) -> AnyObject? {
        return [data[rowIndex],labels]
    }
    
    func UIColorFromRGB(colorCode: String, alpha: Float = 1.0) -> UIColor {
        let scanner = NSScanner(string:colorCode)
        var color:UInt32 = 0;
        scanner.scanHexInt(&color)
        let mask = 0x000000FF
        let r = CGFloat(Float(Int(color >> 16) & mask)/255.0)
        let g = CGFloat(Float(Int(color >> 8) & mask)/255.0)
        let b = CGFloat(Float(Int(color) & mask)/255.0)
        return UIColor(red: r, green: g, blue: b, alpha: CGFloat(alpha))
    }
}
