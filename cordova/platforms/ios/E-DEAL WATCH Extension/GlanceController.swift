//
//  GlanceController.swift
//  E-DEAL Contact
//
//  Created by mac on 11/4/15.
//
//

import WatchKit
import Foundation
import WatchConnectivity

class GlanceController: WKInterfaceController {
    
    @IBOutlet var eventsTable: WKInterfaceTable!
    @IBOutlet var timeLabel: WKInterfaceLabel!
    @IBOutlet var monthDayLabel: WKInterfaceLabel!
    @IBOutlet var weekDayLabel: WKInterfaceLabel!
    var session : WCSession!
    var data : NSArray!
    let defaults = NSUserDefaults(suiteName:
        "group.com.domain.edealContactV2")
    
    override func awakeWithContext( context: AnyObject?) {
        super.awakeWithContext(context)
        // Configure interface objects here.
    }

    override func willActivate() {
        // This method is called when watch view controller is about to be visible to user
        super.willActivate()
        defaults!.synchronize()
        let glanceData = defaults?.dictionaryForKey("glance")
        print(glanceData)
        
        let curDate = NSDate()
        //let in4days = curDate.dateByAddingTimeInterval(24 * 60 * 60 * 4)
        print (curDate)
        data = glanceData!["result"] as! NSArray
        if data != nil {
            let dateFormatterOld = NSDateFormatter()
            let dateFormatterNew = NSDateFormatter()
            let dateFormatterYear = NSDateFormatter()
            let dateFormatterMonth = NSDateFormatter()
            let dateFormatterDay = NSDateFormatter()
            let timeFormatterOld = NSDateFormatter()
            let timeFormatterNew = NSDateFormatter()
            let calendar = NSCalendar.autoupdatingCurrentCalendar()
            let components = NSDateComponents()
            let weekDayFormatter = NSDateFormatter()
            dateFormatterOld.dateFormat = "dd/MM/yyyy"
            timeFormatterOld.dateFormat = "HH:mm"
            dateFormatterYear.dateFormat = "yyyy"
            dateFormatterMonth.dateFormat = "M"
            dateFormatterDay.dateFormat = "d"
            let parsedLocale = NSLocale.init(localeIdentifier: glanceData!["locale"] as! String)
            dateFormatterNew.locale = parsedLocale
            timeFormatterNew.locale = parsedLocale
            weekDayFormatter.locale = parsedLocale
            dateFormatterNew.setLocalizedDateFormatFromTemplate("EdMMM")
            let fullDateFormatterOld = NSDateFormatter()
            fullDateFormatterOld.dateFormat = "dd/MM/yyyy HH:mm"
            timeFormatterNew.timeStyle = NSDateFormatterStyle.ShortStyle
            weekDayFormatter.dateFormat = "EEEE"
            var upcoming=0,found=false,startDateFromString:NSDate!;
            while (upcoming<data.count) && (found==false) {
                startDateFromString = fullDateFormatterOld.dateFromString("\(data[upcoming][0].valueForKey("content") as! String) \(data[upcoming][2].valueForKey("content") as! String)")
                if curDate.compare(startDateFromString!) == .OrderedAscending {
                    print("next event at: \(startDateFromString)")
                    found=true;
                } else { upcoming++ }
            }
            if found == false {
                print("no upcoming events")
            } else {
                let startTimeFromString = timeFormatterOld.dateFromString(data[upcoming][2].valueForKey("content") as! String)
                let endTimeFromString = timeFormatterOld.dateFromString(data[upcoming][3].valueForKey("content") as! String)
                timeLabel.setText("\(timeFormatterNew.stringFromDate(startTimeFromString!)) - \(timeFormatterNew.stringFromDate(endTimeFromString!))")
                monthDayLabel.setText(dateFormatterDay.stringFromDate(startDateFromString))
                weekDayLabel.setText(weekDayFormatter.stringFromDate(startDateFromString))
                var sameDates=0,c=upcoming+1
                while c < data.count {
                    if (data[upcoming][2].valueForKey("content") as! String == data[c][2].valueForKey("content") as! String) {
                        sameDates++
                        c++
                    } else { break }
                }
                print("Same Dates = \(sameDates)")
                if sameDates > 1 {
                    timeLabel.setText("\(timeFormatterNew.stringFromDate(startTimeFromString!))")
                }
                var labelWidth: CGFloat = WKInterfaceDevice.currentDevice().screenBounds.width
                labelWidth = labelWidth - 11.5
                let font = UIFont.systemFontOfSize(16)
                
                switch sameDates {
                case 0:
                    eventsTable.setNumberOfRows(sameDates+1, withRowType: "GlanceTRC")
                    let subjectText = data[upcoming][1].valueForKey("content") as! String
                    let placeText = data[upcoming][4].valueForKey("content") as! String
                    let row = eventsTable.rowControllerAtIndex(0) as! GlanceTableRowController
                    row.subjectLabel.setText(subjectText)
                    row.subjectLabel.setWidth(labelWidth)
                    row.placeLabel.setText(placeText)
                    row.placeLabel.setWidth(labelWidth)
                    let colorString = data[upcoming][9].valueForKey("content") as? String
                    if parsedColor(colorString!) != "" {
                        row.typeSeparator.setHidden(false)
                        row.typeSeparator.setColor(UIColorFromRGB(parsedColor(colorString!)))
                    }
                    let subjectRect:CGRect = subjectText.boundingRectWithSize(CGSizeMake(labelWidth,CGFloat(MAXFLOAT)), options: NSStringDrawingOptions.UsesLineFragmentOrigin, attributes: [NSFontAttributeName : font], context: nil)
                    let subjectLineCount =  ceil(subjectRect.size.height / font.lineHeight)
                    print("Subject Line Count = \(subjectLineCount)")
                    if placeText == "" {
                        row.placeLabel.setHidden(true)
                        print("Place Not Specified")
                        if subjectLineCount > 4 {
                            row.rowGroup.setRelativeHeight(0.68, withAdjustment: 0)
                            row.subjectLabel.setRelativeHeight(1.0, withAdjustment: 0)
                        }
                    } else {
                        let placeRect:CGRect = placeText.boundingRectWithSize(CGSizeMake(labelWidth,CGFloat(MAXFLOAT)), options: NSStringDrawingOptions.UsesLineFragmentOrigin, attributes: [NSFontAttributeName : font], context: nil)
                        let placeLineCount = ceil(placeRect.size.height / font.lineHeight)
                        print("Place Line Count = \(placeLineCount)")
                        if (subjectLineCount + placeLineCount) > 4 {
                            row.rowGroup.setRelativeHeight(0.68, withAdjustment: 0)
                            if subjectLineCount == 1 {
                                row.subjectLabel.setRelativeHeight(0.25, withAdjustment: 0)
                                row.placeLabel.setRelativeHeight(0.75, withAdjustment: 0)
                            }
                            else if placeLineCount == 1 {
                                row.subjectLabel.setRelativeHeight(0.75, withAdjustment: 0)
                                row.placeLabel.setRelativeHeight(0.25, withAdjustment: 0)
                            }
                            else {
                                row.subjectLabel.setRelativeHeight(0.5, withAdjustment: 0)
                                row.placeLabel.setRelativeHeight(0.5, withAdjustment: 0)
                            }
                        }
                    }
                    break
                case 1:
                    eventsTable.setNumberOfRows(sameDates+1, withRowType: "GlanceTRC")
                    let row1 = eventsTable.rowControllerAtIndex(0) as! GlanceTableRowController
                    let row2 = eventsTable.rowControllerAtIndex(1) as! GlanceTableRowController
                    let subjectText1 = data[upcoming][1].valueForKey("content") as! String
                    let placeText1 = data[upcoming][4].valueForKey("content") as! String
                    let subjectText2 = data[upcoming+1][1].valueForKey("content") as! String
                    let placeText2 = data[upcoming+1][4].valueForKey("content") as! String
                    row1.subjectLabel.setText(subjectText1)
                    row1.subjectLabel.setWidth(labelWidth)
                    row1.placeLabel.setText(placeText1)
                    row1.placeLabel.setWidth(labelWidth)
                    row2.subjectLabel.setText(subjectText2)
                    row2.subjectLabel.setWidth(labelWidth)
                    row2.placeLabel.setText(placeText2)
                    row2.placeLabel.setWidth(labelWidth)
                    let colorString1 = data[upcoming][9].valueForKey("content") as? String
                    let colorString2 = data[upcoming][9].valueForKey("content") as? String
                    if parsedColor(colorString1!) != "" {
                        row1.typeSeparator.setHidden(false)
                        row1.typeSeparator.setColor(UIColorFromRGB(parsedColor(colorString1!)))
                    }
                    if parsedColor(colorString2!) != "" {
                        row2.typeSeparator.setHidden(false)
                        row2.typeSeparator.setColor(UIColorFromRGB(parsedColor(colorString2!)))
                    }
                    let subjectRect1:CGRect = subjectText1.boundingRectWithSize(CGSizeMake(labelWidth,CGFloat(MAXFLOAT)), options: NSStringDrawingOptions.UsesLineFragmentOrigin, attributes: [NSFontAttributeName : font], context: nil)
                    let subjectRect2:CGRect = subjectText2.boundingRectWithSize(CGSizeMake(labelWidth,CGFloat(MAXFLOAT)), options: NSStringDrawingOptions.UsesLineFragmentOrigin, attributes: [NSFontAttributeName : font], context: nil)
                    let subjectLineCount1 =  ceil(subjectRect1.size.height / font.lineHeight)
                    print("Subject Line Count 1 = \(subjectLineCount1)")
                    let subjectLineCount2 =  ceil(subjectRect2.size.height / font.lineHeight)
                    print("Subject Line Count 2 = \(subjectLineCount2)")
                    break
                default:
                    break
                }
                
            }
            
            //        switch lineCount {
            //        case 1:
            //        case 2:
            //        }
            
            //        switch sameDates {
            //            case 1:
            //                let row = self.eventsTable.rowControllerAtIndex(0) as! EventsTableRowController
            //                //row.placeLabel.
            //            default:
            //                break
            //        }
            
            for (var i=0;i<data.count;i++) {
                let startDateFromString = fullDateFormatterOld.dateFromString("\(data[i][0].valueForKey("content") as! String) \(data[i][2].valueForKey("content") as! String)")
                let endDateFromString = fullDateFormatterOld.dateFromString("\(data[i][0].valueForKey("content") as! String) \(data[i][3].valueForKey("content") as! String)")
                print(startDateFromString!,endDateFromString!)
                
                let dateFromString = dateFormatterOld.dateFromString(data[i][0].valueForKey("content") as! String)
                //let startTimeFromString = timeFormatterOld.dateFromString(data[i][2].valueForKey("content") as! String)
                //let endTimeFromString = timeFormatterOld.dateFromString(data[i][3].valueForKey("content") as! String)
                let stringDateYear = dateFormatterYear.stringFromDate(dateFromString!)
                let stringDateMonth = dateFormatterMonth.stringFromDate(dateFromString!)
                let stringDateDay = dateFormatterDay.stringFromDate(dateFromString!)
                components.year = Int(stringDateYear)!
                components.month = Int(stringDateMonth)!
                components.day = Int(stringDateDay)!
                //let newDate = calendar.dateFromComponents(components)
                //let prettyDate = dateFormatterNew.stringFromDate(newDate!)
                //print("\(prettyDate) \(startTimeFromString)-\(endTimeFromString)")
            }
        }
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
    
    func parsedColor(colorString : String) -> String {
        let colorArray = (colorString.componentsSeparatedByString("|")) as [String]
        if colorArray.count >= 3 {
            if colorArray[2].substringToIndex(colorArray[2].startIndex.advancedBy(1)) == "#" {
                let colorHexArray = colorArray[2].componentsSeparatedByString("#")
                let trimmedString = colorHexArray[1]
                if trimmedString.characters.count == 6 {
                    let regex = try! NSRegularExpression(pattern: "^[0-9a-f]*$", options: .CaseInsensitive)
                    let found = regex.firstMatchInString(trimmedString, options: [], range: NSMakeRange(0, trimmedString.characters.count))
                    if (found != nil) && (found?.range.location != NSNotFound) {
                        return colorHexArray[1]
                    }
                }
            }
        }
        return ""
    }
}
