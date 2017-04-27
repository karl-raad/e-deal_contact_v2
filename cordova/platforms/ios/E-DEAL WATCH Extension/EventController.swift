//
//  EventControllerInterfaceController.swift
//  E-DEAL Contact
//
//  Created by mac on 10/12/15.
//
//

import WatchKit
import Foundation

class EventController: WKInterfaceController {
    
    @IBOutlet var correspondentsMetaLabel: WKInterfaceLabel!
    @IBOutlet var notesMetaLabel: WKInterfaceLabel!
    @IBOutlet var creatorMetaLabel: WKInterfaceLabel!
    @IBOutlet var typeMetaLabel: WKInterfaceLabel!
    @IBOutlet var subjectLabel: WKInterfaceLabel!
    @IBOutlet var placeLabel: WKInterfaceLabel!
    @IBOutlet var typeSeparator: WKInterfaceSeparator!
    @IBOutlet var notesGroup: WKInterfaceGroup!
    @IBOutlet var notesLabel: WKInterfaceLabel!
    @IBOutlet var creatorLabel: WKInterfaceLabel!
    @IBOutlet var typeLabel: WKInterfaceLabel!
    @IBOutlet var timeLabel: WKInterfaceLabel!
    @IBOutlet var placeGroup: WKInterfaceGroup!
    @IBOutlet var correspondentsGroup: WKInterfaceGroup!
    @IBOutlet var correspondentsTable: WKInterfaceTable!
    var correspondents : NSArray!
    var place : String!
    var data : NSArray!
    var labels : NSDictionary!
    
    override func awakeWithContext(context: AnyObject?) {
        super.awakeWithContext(context)
        // Configure interface objects here.
        print(context)
        data = context?.objectAtIndex(0) as! NSArray
        labels = context?.objectAtIndex(1) as! NSDictionary
        typeMetaLabel.setText(labels.valueForKey("TYPE") as? String)
        creatorMetaLabel.setText(labels.valueForKey("CREATOR") as? String)
        notesMetaLabel.setText(labels.valueForKey("NOTES") as? String)
        correspondentsMetaLabel.setText(labels.valueForKey("CORRESPONDENTS") as? String)
        place = data[4].valueForKey("content") as? String
        let dateFormatterOld = NSDateFormatter()
        let dateFormatterNew = NSDateFormatter()
        let dateFormatterYear = NSDateFormatter()
        let dateFormatterMonth = NSDateFormatter()
        let dateFormatterDay = NSDateFormatter()
        let timeFormatterOld = NSDateFormatter()
        let timeFormatterNew = NSDateFormatter()
        let calendar = NSCalendar.autoupdatingCurrentCalendar()
        let dateFormat = NSDateFormatter.dateFormatFromTemplate("EdMMM", options: 0, locale: NSLocale.autoupdatingCurrentLocale())
        let components = NSDateComponents()
        dateFormatterOld.dateFormat = "dd/MM/yyyy"
        timeFormatterOld.dateFormat = "HH:mm"
        dateFormatterYear.dateFormat = "yyyy"
        dateFormatterMonth.dateFormat = "M"
        dateFormatterDay.dateFormat = "d"
        dateFormatterNew.dateFormat = dateFormat
        timeFormatterNew.locale = NSLocale.autoupdatingCurrentLocale()
        timeFormatterNew.timeStyle = NSDateFormatterStyle.ShortStyle
        let dateFromString = dateFormatterOld.dateFromString((data[0].valueForKey("content") as? String)!)
        let startTimeFromString = timeFormatterOld.dateFromString((data[2].valueForKey("content") as? String)!)
        let endTimeFromString = timeFormatterOld.dateFromString((data[3].valueForKey("content") as? String)!)
        let stringDateYear = dateFormatterYear.stringFromDate(dateFromString!)
        let stringDateMonth = dateFormatterMonth.stringFromDate(dateFromString!)
        let stringDateDay = dateFormatterDay.stringFromDate(dateFromString!)
        components.year = Int(stringDateYear)!
        components.month = Int(stringDateMonth)!
        components.day = Int(stringDateDay)!
        let newDate = calendar.dateFromComponents(components)
        let prettyDate = dateFormatterNew.stringFromDate(newDate!)
        setTitle("< \(prettyDate)")
        subjectLabel.setText(data[1].valueForKey("content") as? String)
        if data[4].valueForKey("content") as? String == "" {
            placeGroup.setHidden(true)
        }
        placeLabel.setText(data[4].valueForKey("content") as? String)
        if (startTimeFromString != nil) || (endTimeFromString != nil) {
            timeFormatterNew.stringFromDate(startTimeFromString!)
            timeLabel.setText("\(timeFormatterNew.stringFromDate(startTimeFromString!)) - \(timeFormatterNew.stringFromDate(endTimeFromString!))")
        }
        else {
            timeLabel.setHidden(true)
        }
        typeLabel.setText(data[5].valueForKey("content") as? String)
        let colorString = data[9].valueForKey("content") as? String
        let colorArray = (colorString?.componentsSeparatedByString("|"))! as [String]
        if colorArray.count < 3 {
            typeSeparator.setHidden(true)
        } else {
            let colorHexArray = colorArray[2].componentsSeparatedByString("#")
            typeSeparator.setColor(UIColorFromRGB(colorHexArray[1]))
        }
        creatorLabel.setText(data[6].valueForKey("content") as? String)
        if data[7].valueForKey("content") as? String == "" {
            notesGroup.setHidden(true)
        }
        notesLabel.setText(data[7].valueForKey("content") as? String)
        if data[8].valueForKey("content") as? String == "[]" || data[8].valueForKey("content") as? String == "" {
            correspondentsGroup.setHidden(true)
        }
        else {
            let jsonData = data[8].valueForKey("content")!.dataUsingEncoding(NSUTF8StringEncoding)!
            do {
                correspondents = try NSJSONSerialization.JSONObjectWithData(jsonData, options: NSJSONReadingOptions.AllowFragments) as! NSArray
                correspondentsTable.setNumberOfRows(correspondents.count, withRowType: "CorrespondentsTRC")
                for (var i=0;i<correspondents.count;i++) {
                    let row = correspondentsTable.rowControllerAtIndex(i) as! CorrespondentsTableRowController
                    row.correspondentsLabel.setText(correspondents[i].valueForKey("name") as? String)
                }
            }
            catch let error as NSError {
                print("A JSON parsing error occurred for EventController:\n \(error)")
            }
        }
    }
    
    override func contextForSegueWithIdentifier(segueIdentifier: String) -> AnyObject? {
        if segueIdentifier == "toPlace" {
            return [place,labels]
        }
        else {
            return nil
        }
    }
    
    override func contextForSegueWithIdentifier(segueIdentifier: String, inTable table: WKInterfaceTable, rowIndex: Int) -> AnyObject? {
        return [correspondents[rowIndex],labels]
    }
    
    override func willActivate() {
        // This method is called when watch view controller is about to be visible to user
        super.willActivate()
    }
    
    override func didDeactivate() {
        // This method is called when watch view controller is no longer visible
        super.didDeactivate()
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
