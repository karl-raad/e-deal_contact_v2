//
//  PlaceController.swift
//  E-DEAL Contact
//
//  Created by mac on 10/12/15.
//
//

import WatchKit
import Foundation
import CoreLocation
import MapKit

class PlaceController: WKInterfaceController,CLLocationManagerDelegate {
    
    var locationManager : CLLocationManager!
    @IBOutlet var placeMap: WKInterfaceMap!
    
    override func awakeWithContext(context: AnyObject?) {
        print(context)
        let place = context?.objectAtIndex(0) as! String
        let title = context?.objectAtIndex(1) as! NSDictionary
        let placeTitle = title.valueForKey("PLACE") as? String
        setTitle("< \(placeTitle!)")
        super.awakeWithContext(context)
        var placemark: CLPlacemark!
        CLGeocoder().geocodeAddressString(place
            , completionHandler: {(placemarks, error) -> Void in
            if error == nil {
                print("Geocoding Successful!")
                placemark = placemarks?.first
                self.placeMap.setRegion(MKCoordinateRegionMake(CLLocationCoordinate2DMake (placemark.location!.coordinate.latitude, placemark.location!.coordinate.longitude), MKCoordinateSpanMake(0.002, 0.002)))
                self.placeMap.addAnnotation((placemark.location?.coordinate)!, withPinColor:WKInterfaceMapPinColor.Red)
            }
        })
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
