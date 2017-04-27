//
//  CorrespondentController.swift
//  E-DEAL Contact
//
//  Created by mac on 10/12/15.
//
//

import WatchKit
import Foundation

class CorrespondentController: WKInterfaceController {
    
    @IBOutlet var correspondentLabel: WKInterfaceLabel!
    @IBOutlet var enterpriseLabel: WKInterfaceLabel!
    @IBOutlet var mobileButton: WKInterfaceButton!
    @IBOutlet var emailButton: WKInterfaceButton!
    @IBOutlet var smsButton: WKInterfaceButton!
    @IBOutlet var phoneButton: WKInterfaceButton!
    @IBOutlet var phoneImage: WKInterfaceImage!
    @IBOutlet var smsImage: WKInterfaceImage!
    @IBOutlet var emailImage: WKInterfaceImage!
    @IBOutlet var mobileImage: WKInterfaceImage!
    var data : NSDictionary!
    var labels : NSDictionary!
    var perPhone : String!
    var perMobile : String!
    var perMail : String!
    var name : String!
    var corp : String!
    
    override func awakeWithContext(context: AnyObject?) {
       
        super.awakeWithContext(context)
        print(context)
        // Configure interface objects here.
        data = context?.objectAtIndex(0) as! NSDictionary
        labels = context?.objectAtIndex(1) as! NSDictionary
        let correspondentTitle = labels.valueForKey("CORRESPONDENT") as? String
        setTitle("< \(correspondentTitle!)")
        name = data.valueForKey("name") as! String
        corp = data.valueForKey("company") as! String
        perPhone = data.valueForKey("phone") as! String
        perMobile = data.valueForKey("mobile") as! String
        perMail = data.valueForKey("email") as! String
        if (name == nil) {
            name = ""
        }
        if (corp == nil) {
            corp = ""
        }
        if ((perPhone == nil) || (perPhone == "")) {
            phoneButton.setEnabled(false)
            phoneImage.setAlpha(0.5)
        }
        if ((perMobile == nil) || (perMobile == "")) {
            mobileButton.setEnabled(false)
            mobileImage.setAlpha(0.5)
            smsButton.setEnabled(false)
            smsImage.setAlpha(0.5)
        }
        if ((perMail == nil) || (perMail == "")) {
            emailButton.setEnabled(false)
            emailImage.setAlpha(0.5)
        }
        correspondentLabel.setText(name)
        enterpriseLabel.setText(corp)
    }
    
    override func willActivate() {
        // This method is called when watch view controller is about to be visible to user
        super.willActivate()
    }
    
    override func didDeactivate() {
        // This method is called when watch view controller is no longer visible
        super.didDeactivate()
    }
    
    @IBAction func phoneCall() {
        let url = NSURL(string:"tel:\(perPhone)".stringByReplacingOccurrencesOfString(" ", withString: ""))
        WKExtension.sharedExtension().openSystemURL(url!)
    }
    
    @IBAction func mobileCall() {
        let url = NSURL(string:"tel:\(perMobile)".stringByReplacingOccurrencesOfString(" ", withString: ""))
        WKExtension.sharedExtension().openSystemURL(url!)
    }
    
    @IBAction func email() {
        presentTextInputControllerWithSuggestions(["Yes","No","Maybe"], allowedInputMode: WKTextInputMode.AllowEmoji, completion: {
            (result) -> Void in
            if result != nil {
            print(result!)
            }
        })
        //WKExtension.sharedExtension().openSystemURL(NSURL(string: "mailto:\(perMail)")!)
        print("mailto:\(perMail)")
    }
    
    @IBAction func sms() {
        let url = NSURL(string:"sms:\(perMobile)".stringByReplacingOccurrencesOfString(" ", withString: ""))
        WKExtension.sharedExtension().openSystemURL(url!)
    }
}
