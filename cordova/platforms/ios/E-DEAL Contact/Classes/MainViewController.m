/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

//
//  MainViewController.h
//  E-DEAL Contact
//
//  Created by ___FULLUSERNAME___ on ___DATE___.
//  Copyright ___ORGANIZATIONNAME___ ___YEAR___. All rights reserved.
//

#import "MainViewController.h"

@implementation MainViewController
@synthesize appContext = _appContext;

- (id)initWithNibName:(NSString*)nibNameOrNil bundle:(NSBundle*)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Uncomment to override the CDVCommandDelegateImpl used
        // _commandDelegate = [[MainCommandDelegate alloc] initWithViewController:self];
        // Uncomment to override the CDVCommandQueue used
        // _commandQueue = [[MainCommandQueue alloc] initWithViewController:self];
    }
    return self;
}

- (id)init
{
    self = [super init];
    if (self) {
        // Uncomment to override the CDVCommandDelegateImpl used
        // _commandDelegate = [[MainCommandDelegate alloc] initWithViewController:self];
        // Uncomment to override the CDVCommandQueue used
        // _commandQueue = [[MainCommandQueue alloc] initWithViewController:self];
    }
    return self;
}

- (void)didReceiveMemoryWarning
{
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];

    // Release any cached data, images, etc that aren't in use.
}

#pragma mark View lifecycle

- (void)viewWillAppear:(BOOL)animated
{
    // View defaults to full size.  If you want to customize the view's size, or its subviews (e.g. webView),
    // you can do so here.
    self.webView.delegate = self;
    [super viewWillAppear:animated];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    if ([WCSession isSupported]) {
        self.session = [WCSession defaultSession];
        self.session.delegate = self;
        [self.session activateSession];
        self.appContext = [[NSMutableDictionary alloc] initWithDictionary:@{@"interactions":@"",@"kpi":@""}];
    }
}

- (void)viewDidUnload
{
    [super viewDidUnload];
    // Release any retained subviews of the main view.
    // e.g. self.myOutlet = nil;
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    // Return YES for supported orientations
    return [super shouldAutorotateToInterfaceOrientation:interfaceOrientation];
}

/* Comment out the block below to over-ride */

/*
- (UIWebView*) newCordovaViewWithFrame:(CGRect)bounds
{
    return[super newCordovaViewWithFrame:bounds];
}
*/

#pragma mark UIWebDelegate implementation

- (void)webViewDidFinishLoad:(UIWebView*)theWebView
{
    // Black base color for background matches the native apps
    theWebView.backgroundColor = [UIColor blackColor];
    return [super webViewDidFinishLoad:theWebView];
}

/* Comment out the block below to over-ride */

/*

- (void) webViewDidStartLoad:(UIWebView*)theWebView
{
    return [super webViewDidStartLoad:theWebView];
}

- (void) webView:(UIWebView*)theWebView didFailLoadWithError:(NSError*)error
{
    return [super webView:theWebView didFailLoadWithError:error];
}
*/
- (BOOL)webView:(UIWebView *)theWebView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
    //NSLog(@"Loading URL :%@",request.URL.absoluteString);
    NSURL *url = request.URL;
    NSString *urlString = [[url absoluteString] stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    if ([[url scheme] isEqualToString:@"invalidSession"]) {
        NSLog(@"%@",urlString);
        [self.session updateApplicationContext:@{@"invalidSession":@"tokenExpired"} error:nil];
    } else if ([[url scheme] isEqualToString:@"error404"]) {
        NSLog(@"%@",urlString);
        [self.session updateApplicationContext:@{@"error404":@"NO_RESPONSE_FROM_SERVER"} error:nil];
    }else {
        if ([[url scheme] isEqualToString:@"interactions"]) {
            urlString = [urlString substringFromIndex:15];
            NSError *error = nil;
            NSDictionary *interactionsDict = [NSJSONSerialization
                                              JSONObjectWithData:[urlString dataUsingEncoding:NSUTF8StringEncoding]
                                              options:0
                                              error:&error];
            if(error) { NSLog(@"JSON Interactions Parsing Error"); }
            [self.appContext setValue:interactionsDict forKey:@"interactions"];
            NSLog(@"%@",self.appContext);
            [self.webView stringByEvaluatingJavaScriptFromString:@"EdealMobile.utils.IWatchJSInterface.callGetKPI()"];
        }
        if ([[url scheme] isEqualToString:@"kpi"]) {
            urlString =[urlString substringFromIndex:6];
            NSError *error = nil;
            NSDictionary *kpiDict = [NSJSONSerialization
                                     JSONObjectWithData:[urlString dataUsingEncoding:NSUTF8StringEncoding]
                                     options:0
                                     error:&error];
            if(error) { NSLog(@"JSON Interactions Parsing Error"); }
            [self.appContext setValue:kpiDict forKey:@"kpi"];
            NSLog(@"%@",self.appContext);
            [self.session updateApplicationContext:self.appContext error:nil];
        }
    }
    return [super webView:theWebView shouldStartLoadWithRequest:request navigationType:navigationType];
}

-(void)session:(nonnull WCSession *)session didReceiveMessage:(nonnull NSDictionary<NSString *,id> *)message replyHandler:(nonnull void (^)(NSDictionary<NSString *,id> * _Nonnull))replyHandler {
    dispatch_async(dispatch_get_main_queue(), ^{
        if ([message isEqualToDictionary:@{@"Request":@"Sync"}]) {
            [self.webView stringByEvaluatingJavaScriptFromString:@"EdealMobile.utils.IWatchJSInterface.callGetInteractionList()"];
        }
        NSLog(@"%@",message);
        NSDictionary *response = @{@"Response" : message};
        replyHandler(response);
    });
}

@end

@implementation MainCommandDelegate

/* To override the methods, uncomment the line in the init function(s)
   in MainViewController.m
 */

#pragma mark CDVCommandDelegate implementation

- (id)getCommandInstance:(NSString*)className
{
    return [super getCommandInstance:className];
}

- (NSString*)pathForResource:(NSString*)resourcepath
{
    return [super pathForResource:resourcepath];
}

@end

@implementation MainCommandQueue

/* To override, uncomment the line in the init function(s)
   in MainViewController.m
 */
- (BOOL)execute:(CDVInvokedUrlCommand*)command
{
    return [super execute:command];
}

@end
