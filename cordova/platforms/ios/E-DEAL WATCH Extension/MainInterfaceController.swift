//
//  MainInterfaceController.swift
//  E-DEAL Contact
//
//  Created by mac on 10/13/15.
//
//

import WatchKit
import Foundation
import WatchConnectivity

class MainInterfaceController: WKInterfaceController,WCSessionDelegate {
    
    @IBOutlet var loginLabel: WKInterfaceLabel!
    var session : WCSession!
    let defaults = NSUserDefaults(suiteName: "group.com.domain.edealContactV2")
    @IBAction func syncAction() {
        if (WCSession.defaultSession().reachable) {
            let message = ["Request" : "Sync"]
            session.sendMessage(message, replyHandler: { (content:[String : AnyObject]) -> Void in
                print("Received: \(content)")
                }, errorHandler: {  (error ) -> Void in
                    print("We got an error from our watch device : " + error.domain)
            })
            WKInterfaceController.reloadRootControllersWithNames(["Loading"], contexts:nil)
        }
    }
    
    override func awakeWithContext(context: AnyObject?) {
        super.awakeWithContext(context)
        // Configure interface objects here.
        if (WCSession.isSupported()) {
            session = WCSession.defaultSession()
            session.delegate = self;
            session.activateSession()
        }
        if (context != nil) && (context as! String == "error404") {
            switch NSLocale.preferredLanguages()[0] {
            case "en":
                loginLabel.setText("Please, upgrade your server")
                break
            case "fr":
                loginLabel.setText("S'il vous plaît, mettez à jour votre serveur")
                break
            case "de":
                loginLabel.setText("Bitte aktualisieren Sie Ihre Server.")
                break
            case "it":
                loginLabel.setText("Per favore, aggiornare il server.")
                break
            case "es":
                loginLabel.setText("Por favor, actualice su servidor")
                break
            case "nl":
                loginLabel.setText("Alstublieft, een upgrade van uw server.")
                break
            default:
                loginLabel.setText("Please, upgrade your server")
            }
        } else {
            switch NSLocale.preferredLanguages()[0] {
            case "en":
                loginLabel.setText("Please login")
                break
            case "fr":
                loginLabel.setText("Loggez vous svp")
                break
            case "de":
                loginLabel.setText("Bitte logge dich ein")
                break
            case "it":
                loginLabel.setText("Accedete per favore")
                break
            case "es":
                loginLabel.setText("Por favor Iniciar sesión")
                break
            case "nl":
                loginLabel.setText("Log alstublieft in")
                break
            default:
                loginLabel.setText("Please Login")
            }
        }
        _ = NSTimer.scheduledTimerWithTimeInterval(1800, target: self, selector: "syncAction", userInfo: nil, repeats: true)
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

    override func willActivate() {
        // This method is called when watch view controller is about to be visible to user
        super.willActivate()
    }

    override func didDeactivate() {
        // This method is called when watch view controller is no longer visible
        super.didDeactivate()
    }

}
